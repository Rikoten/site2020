(() => {
    const pinToggleButton = document.getElementById('toggle-pin')
    const liveToggleButton = document.getElementById('toggle-live')
    const pinListElement = document.getElementById('pin-list')
    const liveListElement = document.getElementById('streaming-list')

    let pinOpen = false
    let liveOpen = false

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
        if (e) {
            if (pinOpen) {
                pinListElement.classList.add('hidden')
                pinOpen = false
                return
            }
            if (liveOpen) {
                liveListElement.classList.add('hidden')
                liveOpen = false
            }
            pinListElement.classList.remove('hidden')
            pinOpen = true
        }

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
            const description = item.eventDesc && item.eventDesc.length > 100 ? item.eventDesc.slice(0, 100) + '...' : item.eventDesc

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

    let streams = []
    /*
        type liveStreamingEvent = {
            date: 6 | 7 | 8
            platform: 'youtube' | 'zoom'
            eventId: string
            startAt: unixTime
            endAt: unixTime
        }
    */
    fetchData().then(res => {
        for (const item of res) {
            if ('youtubeLive' in item) {
                for (const live of item.youtubeLive) {
                    const liveEvent = {
                        date: Number.parseInt(live.day),
                        platform: 'youtube',
                        eventId: item.eventID,
                        startAt: Number.parseInt(live.timestampStart) * 1000,
                        endAt: Number.parseInt(live.timestampEnd) * 1000
                    }
                    streams.push(liveEvent)
                }
            }
            if ('zoomTimestamp' in item && 'day1' in item.zoomTimestamp) {
                for (const [ startAt, endAt ] of item.zoomTimestamp.day1) {
                    const liveEvent = {
                        date: 7,
                        platform: 'zoom',
                        eventId: item.eventID,
                        startAt: Number.parseInt(startAt) * 1000,
                        endAt: Number.parseInt(endAt) * 1000
                    }
                    streams.push(liveEvent)
                }
            }
            if ('zoomTimestamp' in item && 'day2' in item.zoomTimestamp) {
                for (const [ startAt, endAt ] of item.zoomTimestamp.day2) {
                    const liveEvent = {
                        date: 8,
                        platform: 'zoom',
                        eventId: item.eventID,
                        startAt: Number.parseInt(startAt) * 1000,
                        endAt: Number.parseInt(endAt) * 1000
                    }
                    streams.push(liveEvent)
                }
            }
        }
        streams.sort((a, b) => a.startAt - b.startAt)

        console.log(streams)
    })

    function convertUnixtimeToReadableTime(unixTime) {
        const date = new Date(unixTime)
        const hour = ('00' + date.getHours()).slice(-2)
        const minutes = ('00' + date.getMinutes()).slice(-2)
        return hour + ':' + minutes
    }

    function streamingItemElement(stream) {
        const event = data.find(it => it.eventID == stream.eventId)

        const innerHTML =  `
            <a href='/event/?id=${ stream.eventId } }'>
                <span class='time'>${ convertUnixtimeToReadableTime(stream.startAt) } ~ ${ convertUnixtimeToReadableTime(stream.endAt) }</span>
                <img src='${ stream.platform == 'youtube' ? '/img/youtube.svg' : '/img/zoom.svg' }'>
                <h2 class='title'>${ event.eventName }</h2>
                <p>${ event.eventDesc && event.eventDesc.length > 70 ? event.eventDesc.slice(0, 70) + '...' : event.eventDesc }</p>
            </a>
        `
        const el = document.createElement('li')
        el.innerHTML = innerHTML
        return el
    }

    liveToggleButton.addEventListener('click', () => {
        if (liveOpen) {
            liveListElement.classList.add('hidden')
            liveOpen = false
            return
        }
        if (pinOpen) {
            pinListElement.classList.add('hidden')
            pinOpen = false
        }
        liveListElement.classList.remove('hidden')
        liveOpen = true

        const time = Date.now()
        const liveStreams = streams.filter(it => it.startAt <= time && time <= it.endAt)

        const liveStreamsUl = document.querySelector('#streaming-list .live ul')
        liveStreamsUl.innerHTML = ''
        for (const liveStream of liveStreams) {
            liveStreamsUl.appendChild(streamingItemElement(liveStream))
        }

        const upcomingStreamsUl = document.querySelector('#streaming-list .upcoming ul')
        upcomingStreamsUl.innerHTML = ''
        const upcomingStreams = streams.filter(it => time <= it.startAt && new Date(time).getDate() == new Date(it.startAt).getDate()).slice(0, 5)
        console.log(upcomingStreams)
        for (const liveStream of upcomingStreams) {
            upcomingStreamsUl.appendChild(streamingItemElement(liveStream))
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
