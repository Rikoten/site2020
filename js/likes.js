const likeButton = document.getElementById('like-button')
const pinButton = document.getElementById('pin')
const likeCounter = document.getElementById('like-count')
const viewsCounter = document.getElementById('views')

let liked = false

const queries = location.search.slice(1).split('&').map(it => ({
    key: it.split('=')[0],
    value: it.split('=')[1]
}))
const eventId = queries.find(it => it.key == 'id').value

;(async () => {
    const likes = await fetch('/api/like').then(res => res.json())
    const likeCount = (likes[eventId] && likes[eventId].likes) || 0

    const views = await fetch('/api/views/' + eventId).then(res => res.json())
    console.log(views)

    likeCounter.textContent = likeCount
    viewsCounter.textContent = views.views
})()

likeButton.addEventListener('click', async () => {
    await fetch('/api/like/' + eventId, {
        credentials: 'include',
        method: 'POST'
    })
    if (liked) return
    liked = true
    likeCounter.textContent = Number.parseInt(likeCounter.textContent) + 1
})

function removePin(id) {
    const preveousPinned = JSON.parse(localStorage.getItem('pin'))
    const i = preveousPinned.findIndex(it => it == id)
    preveousPinned.splice(i, 1)
    localStorage.setItem('pin', JSON.stringify(preveousPinned))
}

function addPin(id) {
    const preveousPinned = new Set(JSON.parse(localStorage.getItem('pin')) || [])
    preveousPinned.add(id)
    localStorage.setItem('pin', JSON.stringify(Array.from(preveousPinned)))
}

function isPinned(id) {
    const preveousPinned = JSON.parse(localStorage.getItem('pin') || '[]')
    return Boolean(preveousPinned.find(it => it == id))
}

if (isPinned(eventId)) pinButton.classList.add('pin-clicked')

pinButton.addEventListener('click', () => {
    if (!isPinned(eventId)) {
        pinButton.classList.add('pin-clicked')
        addPin(eventId)
    } else {
        pinButton.classList.remove('pin-clicked')
        removePin(eventId)
    }
})
