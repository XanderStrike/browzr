fetch("/filelist")
  .then(response => response.json())
  .then(data => {
    // console.log(data)
    const options = {
      includeScore: true,
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      minMatchCharLength: 2,
      keys: [{
        name: 'f',
        weight: 2.0
      }, {
        name: 'd',
        weight: 1.0
      }],
      findAllMatches: true,
      ignoreLocation: true
    }

    const fuse = new Fuse(data, options)
    const searchInput = document.querySelector('.search')
    const statusEl = document.querySelector('.status')
    const resultsEl = document.querySelector('.results')

    // Function to get random items from array
    function getRandomItems(arr, count) {
      const shuffled = [...arr].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    }

    // Function to render files
    function renderFiles(files) {
      return files.map(file => {
        return `<a href="${file.p}">
          <li>
            ${getFileIcon(file.f)}
            <span class="file-details">
              <span class="filename">
                <span class="filepath">${file.d}</span>${file.f}
              </span>
              <span class="filesize">${file.s}</span>
            </span>
          </li>
        </a>`
      }).join('')
    }

    // Restore search from URL hash on page load
    const initialSearch = decodeURIComponent(window.location.hash.slice(1))
    if (initialSearch) {
      searchInput.value = initialSearch
      performSearch(initialSearch)
    }

    function performSearch(query) {
      if (!query) {
        // Show random files when search is empty
        const randomFiles = getRandomItems(data, 50)
        resultsEl.innerHTML = renderFiles(randomFiles)
        return
      }

      const result = fuse.search(query.toLowerCase())
      resultsEl.innerHTML = renderFiles(result.slice(0, 200).map(x => x.item))
      statusEl.textContent = `Found ${result.length} files`
    }

    searchInput.addEventListener('input', debounce(() => {
      const query = searchInput.value
      // Update URL hash without triggering history entry
      window.location.replace('#' + encodeURIComponent(query))
      performSearch(query)
    }, 500))

    // Listen for back/forward navigation
    window.addEventListener('hashchange', () => {
      const query = decodeURIComponent(window.location.hash.slice(1))
      searchInput.value = query
      performSearch(query)
    })

    statusEl.textContent = `Indexed ${data.length} files. Start typing to search.`
    performSearch('')
  })
  .catch(error => {
    document.querySelector('.status').textContent = `Error loading files: ${error.message}`
  })

function debounce(func, wait, immediate) {
  let timeout
  return function() {
    const context = this
    const args = arguments
    const later = () => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  const iconMap = {
    // Images
    'jpg': 'fa-image',
    'jpeg': 'fa-image',
    'png': 'fa-image',
    'gif': 'fa-image',
    'svg': 'fa-image',
    
    // Documents
    'pdf': 'fa-file-pdf',
    'doc': 'fa-file-word',
    'docx': 'fa-file-word',
    'txt': 'fa-file-lines',
    'md': 'fa-file-lines',
    
    // Code
    'html': 'fa-html5',
    'css': 'fa-css',
    'js': 'fa-js',
    'jsx': 'fa-react',
    'ts': 'fa-code',
    'go': 'fa-code',
    'py': 'fa-python',
    'java': 'fa-java',
    'php': 'fa-php',
    'rb': 'fa-gem',
    
    // Archives
    'zip': 'fa-file-zipper',
    'rar': 'fa-file-zipper',
    'tar': 'fa-file-zipper',
    'gz': 'fa-file-zipper',
    '7z': 'fa-file-zipper',
    
    // Video/Audio
    'mp4': 'fa-file-video',
    'mov': 'fa-file-video',
    'avi': 'fa-file-video',
    'mkv': 'fa-file-video',
    'mp3': 'fa-file-audio',
    'wav': 'fa-file-audio',
    'ogg': 'fa-file-audio',
    'flac': 'fa-file-audio',
    'aac': 'fa-file-audio',
    'wma': 'fa-file-audio',
    'm4a': 'fa-file-audio',
    'm4b': 'fa-file-audio',
    'm4p': 'fa-file-audio',
    'm4r': 'fa-file-audio',
    'm4v': 'fa-file-video',
    'mpg': 'fa-file-video',
    'mpeg': 'fa-file-video',
    'mpg': 'fa-file-video',
    'mpeg': 'fa-file-video',

    // Others
    'json': 'fa-code',
    'xml': 'fa-code',
    'yml': 'fa-code',
    'yaml': 'fa-code',
    'csv': 'fa-table',
    'xls': 'fa-file-excel',
    'xlsx': 'fa-file-excel',
    'ppt': 'fa-file-powerpoint',
    'pptx': 'fa-file-powerpoint',
  };

  const icon = iconMap[ext] || 'fa-file';
  return `<i class="fa-solid ${icon} file-icon"></i>`;
} 