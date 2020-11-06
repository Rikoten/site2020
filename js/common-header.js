(() => {
    const pinToggleButton = document.getElementById('toggle-pin')
    const pinListElement = document.getElementById('pin-list')

    let data =[]

    fetchData().then(res => {
        data = res
    })

    const pinItem = (eventId, type, time, title, description) => `
        <a href='/event/?id=${eventId}'>
            <span class='type'>${type}</span>
            <span class='time'>${time}</span>
            <h2>${title}</h2>
            <p>${description}</p>
            <button class='close' data-event-id=${eventId}>×</button>
        </a>
    `

    pinToggleButton.addEventListener('click', function pinToggleEventListener(e) {
        if (e) pinListElement.classList.toggle('hidden')

        const pins = JSON.parse(localStorage.getItem('pin') || '[]')
        console.log(pins.length == 0)
        if (pins.length == 0) {
            document.querySelector('#pin-list .no-pins').classList.add('shown')
        } else {
            document.querySelector('#pin-list .no-pins').classList.remove('shown')
        }

        document.querySelector('#pin-list ul').innerHTML = ''

        for (const pin of pins) {
            const item = data.find(it => it.eventID == pin)
            const description = item.eventDesc.length > 100 ? item.eventDesc.slice(0, 100) + '...' : item.eventDesc

            const li = document.createElement('li')
            li.innerHTML = pinItem(pin, item.eventType, item.requiredTime || '', item.eventName, description)
            li.classList.add('item')
            document.querySelector('#pin-list ul').appendChild(li)

            li.querySelector('button').addEventListener('click', e => {
                e.preventDefault()

                const preveousPinned = JSON.parse(localStorage.getItem('pin'))
                const i = preveousPinned.findIndex(it => it == pin)
                preveousPinned.splice(i, 1)
                localStorage.setItem('pin', JSON.stringify(preveousPinned))
                pinToggleEventListener()
            })
        }
    })

    async function fetchData() {
        const isEnglish = localStorage.getItem('lang') == 'en'

        const jp = await fetch('/data/eventData.json').then(res => res.json())

        if (!isEnglish) {
            return jp
        }

        const en = await fetch('/data/eventData_en.json').then(res => res.json())
        for (const item of jp) {
            const existsEnglishData = en.find(it => it.eventID == item.eventID) != null
            if (existsEnglishData) continue
            en.push(item)
        }

        return en
    }
})()
