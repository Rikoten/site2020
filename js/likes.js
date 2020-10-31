const likeButton = document.getElementById('like-button')
const likeCounter = document.getElementById('like-count')

const queries = location.search.slice(1).split('&').map(it => ({
    key: it.split('=')[0],
    value: it.split('=')[1]
}))
const eventId = queries.find(it => it.key == 'id').value

;(async () => {
    const likes = await fetch('/api/like').then(res => res.json())
    const likeCount = (likes[eventId] && likes[eventId].likes) || 0
    likeCounter.textContent = likeCount
})()

likeButton.addEventListener('click', async () => {
    await fetch('/api/like/' + eventId, {
        credentials: 'include',
        method: 'POST'
    })
    likeCounter.textContent = Number.parseInt(likeCounter.textContent) + 1
})
