import React, { useEffect, useState } from 'react'
import './styles.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export default function App() {
    const [todos, setTodos] = useState([])
    const [text, setText] = useState('')

    async function load() {
        const res = await fetch(`${BACKEND}/api/todos`)
        setTodos(await res.json())
    }

    useEffect(() => { load() }, [])

    async function addTodo(e) {
        e.preventDefault()
        if (!text.trim()) return
        await fetch(`${BACKEND}/api/todos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
        setText('')
        load()
    }

    async function toggle(id) {
        await fetch(`${BACKEND}/api/todos/${id}/toggle`, { method: 'PUT' })
        load()
    }

    return (
        <div className="container">
            <h1>Minimal Todos</h1>
            <div className="sub">A tiny example — add, list and toggle</div>
            <form onSubmit={addTodo} className="form-row">
                <input className="todo-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo" />
                <button type="submit" disabled={!text.trim()}>Add</button>
            </form>
            {todos.length === 0 ? (
                <div className="no-todos">No todos yet — add one above</div>
            ) : (
                <ul>
                    {todos.map(t => (
                        <li key={t.id} className={t.done ? 'done' : ''}>
                            <div className="todo-text">{t.text}</div>
                            <button className="small-btn" onClick={() => toggle(t.id)}>{t.done ? 'Undo' : 'Done'}</button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="footer">Lightweight stack — Express + Postgres</div>
        </div>
    )
}
