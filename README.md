# Wealthy Presence UI

Using Hono & React for a simple but efficient UI so you can
control your wealthy-presence instance from (probably) anywhere.

## Why Hono & React?

I tried to implement this with HTMX but i needed something more robust to handle complex changes in the UI
if one preset changes.

The problem i had with HTMX is that you can't control the whole app, and your API is limited to HTML (unless you use client-side
templating, which is tedious and unsafe). I also wanted to have a JSON API so it's more flexible. I couldn't get a react app working
with a dynamic server, since i want it to be a function to run it, but after some thinking i realized it's possible by serving the
app as a static file after building it with Vite. There's probably an even better way but for now it's ok.

React, because i know UI libraries that make my life easier.

Hono, because Express is hell and slow. Hono is great and faster (and better ok) and i like the ecosystem.

## How to use it?

Still in development.

## Remaining questions

- How to link the Vite server with the Hono server in development? should i dynamically create a Vite server from there?
- How to handle the API URL (e.g: "POST http://localhost:4232/run" -> "/run")? Constraints: the user decides the port, so i might need to create a Vite server by hand. Technically it works on production but in development it doesn't, i'm not even sure of what i'm saying.

## TODOs

- [ ] Make multiple queues with multiple presets inside of them (have to save them somewhere)
