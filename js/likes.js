const likeButton = document.getElementById('like-button')
const likeCounter = document.getElementById('like-count')

const queries = location.search.slice(1).split('&').map(it => ({
    key: it.split('=')[0],
    value: it.split('=')[1]
}))

(async () => {
    const likes = await fetch('/api/like')
    const likeCount = (likes[queries[id]] && likes[queries[id]].likes) || 0
    likeCount.textContent = likeCount
})()

likeButton.addEventListener('click', async () => {
    await fetch('/api/like/' + queries[id], {
        credentials: 'include',
        method: 'POST'
    })
    likeCounter.textContent = Number.parseInt(likeCounter.textContent) + 1
})
