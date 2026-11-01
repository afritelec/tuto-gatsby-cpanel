import * as React from 'react'
import './taches.css'

async function api(method, data) {
  const response = await fetch('/api/tasks.php', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data && JSON.stringify(data),
  })
  return response.json()
}

export default function Page() {
  const [tasks, setTasks] = React.useState([])
  const [title, setTitle] = React.useState('')

  React.useEffect(() => {
    api('GET').then(setTasks)
  }, [])

  async function add(event) {
    event.preventDefault()
    setTasks(await api('POST', { title }))
    setTitle('')
  }

  async function save(task) {
    setTasks(await api('PATCH', task))
  }

  function rename(task, value) {
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, title: value } : t)))
  }

  return (
    <main>
      <h1>Mes tâches</h1>
      <p>Mise à jour déployée avec Git et cPanel.</p>

      <form onSubmit={add}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nouvelle tâche" required maxLength={255} />
        <button>Ajouter</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={Number(task.done) ? 'done' : ''}>
            <button className="gris" onClick={() => save({ ...task, done: Number(task.done) ? 0 : 1 })}>
              {Number(task.done) ? '✓' : '○'}
            </button>
            <input value={task.title} onChange={(e) => rename(task, e.target.value)} required maxLength={255} />
            <button className="gris" onClick={() => save(task)}>Modifier</button>
            <button className="gris" onClick={async () => setTasks(await api('DELETE', { id: task.id }))}>Supprimer</button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export const Head = () => <title>Mes tâches</title>
