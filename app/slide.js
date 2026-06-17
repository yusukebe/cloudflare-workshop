// Lightweight slide engine. Injected inline (see _renderer.tsx) on pages with
// `slide: true` in frontmatter. Splits the rendered body into slides and adds
// keyboard / click navigation. Plain browser JS (no build transform).
;(function () {
  var root = document.getElementById('slides')
  if (!root) return
  var nodes = Array.prototype.slice.call(root.childNodes)

  function isMeaningful(node) {
    return node.nodeType !== 3 || node.textContent.trim().length > 0
  }
  function isHr(n) {
    return n.tagName === 'HR'
  }
  function beforeHeading(n) {
    return n.tagName === 'H1' || n.tagName === 'H2'
  }
  function splitOn(test) {
    var groups = []
    var current = document.createElement('section')
    current.className = 'slide'
    function flush() {
      for (var i = 0; i < current.childNodes.length; i++) {
        if (isMeaningful(current.childNodes[i])) {
          groups.push(current)
          return
        }
      }
    }
    nodes.forEach(function (node) {
      if (node.nodeType === 1 && test(node)) {
        flush()
        current = document.createElement('section')
        current.className = 'slide'
        if (test === beforeHeading) current.appendChild(node)
      } else {
        current.appendChild(node.cloneNode(true))
      }
    })
    flush()
    return groups
  }

  var slides = splitOn(isHr)
  // Fallback: no '---' separators -> split before each H1/H2 heading
  if (slides.length < 2) slides = splitOn(beforeHeading)

  // Slidev-style columns: a `::right::` marker splits a slide into two columns.
  // A leading heading stays full-width on top (like slidev's two-cols-header).
  function isColumnMarker(n) {
    if (n.nodeType !== 1 || n.tagName !== 'P') return false
    var t = n.textContent.trim()
    return t === '::right::' || t === ':::'
  }
  function applyColumns(slide) {
    var kids = Array.prototype.slice.call(slide.childNodes)
    var markerIdx = -1
    for (var i = 0; i < kids.length; i++) {
      if (isColumnMarker(kids[i])) {
        markerIdx = i
        break
      }
    }
    if (markerIdx === -1) return
    var cols = document.createElement('div')
    cols.className = 'cols'
    var left = document.createElement('div')
    var right = document.createElement('div')
    cols.appendChild(left)
    cols.appendChild(right)
    kids.forEach(function (n, i) {
      if (i === markerIdx) return // drop the marker itself
      ;(i < markerIdx ? left : right).appendChild(n)
    })
    slide.innerHTML = ''
    // Lift a leading heading out of the left column to span the full width.
    var first = left.firstElementChild
    if (first && /^H[1-3]$/.test(first.tagName)) slide.appendChild(first)
    slide.appendChild(cols)
  }
  slides.forEach(applyColumns)

  root.innerHTML = ''
  slides.forEach(function (s) {
    root.appendChild(s)
  })

  // Add a copy button to every code block.
  Array.prototype.forEach.call(root.querySelectorAll('pre'), function (pre) {
    var code = pre.querySelector('code') || pre
    var btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'copy-btn'
    btn.textContent = 'Copy'
    btn.addEventListener('click', function () {
      var text = code.innerText
      var done = function () {
        btn.textContent = 'Copied!'
        btn.classList.add('copied')
        setTimeout(function () {
          btn.textContent = 'Copy'
          btn.classList.remove('copied')
        }, 1200)
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done)
      } else {
        var ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        try {
          document.execCommand('copy')
        } catch (e) {}
        document.body.removeChild(ta)
        done()
      }
    })
    pre.appendChild(btn)
  })

  var idx = 0
  var counter = document.getElementById('counter')
  var progress = document.getElementById('progress')

  function render() {
    slides.forEach(function (s, i) {
      s.classList.toggle('active', i === idx)
    })
    counter.textContent = idx + 1 + ' / ' + slides.length
    progress.style.width = ((idx + 1) / slides.length) * 100 + '%'
    var active = slides[idx]
    if (active) active.scrollTop = 0
  }
  function clamp(n) {
    return Math.max(0, Math.min(slides.length - 1, n))
  }
  // Push a history entry so the browser back/forward buttons move between slides.
  function go(n) {
    var next = clamp(n)
    if (next === idx) return
    idx = next
    render()
    history.pushState(null, '', '#' + (idx + 1))
  }
  window.addEventListener('popstate', function () {
    var h = parseInt((location.hash || '').replace('#', ''), 10)
    idx = h ? clamp(h - 1) : 0
    render()
  })

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (
      ['ArrowRight', 'ArrowDown', ' ', 'PageDown'].indexOf(e.key) > -1
    ) {
      go(idx + 1)
      e.preventDefault()
    } else if (
      ['ArrowLeft', 'ArrowUp', 'PageUp'].indexOf(e.key) > -1
    ) {
      go(idx - 1)
      e.preventDefault()
    } else if (e.key === 'Home') {
      go(0)
    } else if (e.key === 'End') {
      go(slides.length - 1)
    } else if (e.key === 'f') {
      if (!document.fullscreenElement)
        document.documentElement.requestFullscreen()
      else document.exitFullscreen()
    }
  })

  var h = parseInt((location.hash || '').replace('#', ''), 10)
  if (h) idx = clamp(h - 1)
  render()
  history.replaceState(null, '', '#' + (idx + 1))
  if (window.hljs) window.hljs.highlightAll()
})()
