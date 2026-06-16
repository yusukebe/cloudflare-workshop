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

  root.innerHTML = ''
  slides.forEach(function (s) {
    root.appendChild(s)
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
    if (history.replaceState)
      history.replaceState(null, '', '#' + (idx + 1))
    var active = slides[idx]
    if (active) active.scrollTop = 0
  }
  function go(n) {
    idx = Math.max(0, Math.min(slides.length - 1, n))
    render()
  }

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
  root.addEventListener('click', function (e) {
    if (e.target.closest('a, pre, img')) return
    go(e.clientX < window.innerWidth / 2 ? idx - 1 : idx + 1)
  })

  var h = parseInt((location.hash || '').replace('#', ''), 10)
  if (h) idx = Math.max(0, Math.min(slides.length - 1, h - 1))
  render()
  if (window.hljs) window.hljs.highlightAll()
})()
