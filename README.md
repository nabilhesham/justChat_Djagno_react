# JustChat - Django & React

- This project is about a chat app that using Django integrated with React.
- [Django Channels](https://channels.readthedocs.io/en/latest/index.html) to make the ASGI Requests
- Uses ReconnectingWebSocket insted of WebSocket
- Uses [Bootsnipp Chat Template](https://bootsnipp.com/)
- Uses [Parceljs](https://parceljs.org/getting_started.html) Instade of WebPackjs

## Dependencies

- Django
- React
- [Parceljs](https://parceljs.org/getting_started.html)
- Babel
- Channels
- Redis
- ReconnectingWebSocket

## How reconnections occur with [ReconnectingWebSocket](https://github.com/joewalnes/reconnecting-websocket)

With the standard `WebSocket` API, the events you receive from the WebSocket instance are typically:

    onopen
    onmessage
    onmessage
    onmessage
    onclose // At this point the WebSocket instance is dead.

With a `ReconnectingWebSocket`, after an `onclose` event is called it will automatically attempt to reconnect. In addition, a connection is attempted repeatedly (with a small pause) until it succeeds. So the events you receive may look something more like:

    onopen
    onmessage
    onmessage
    onmessage
    onclose
    // ReconnectingWebSocket attempts to reconnect
    onopen
    onmessage
    onmessage
    onmessage
    onclose
    // ReconnectingWebSocket attempts to reconnect
    onopen
    onmessage
    onmessage
    onmessage
    onclose

This is all handled automatically for you by the library.
