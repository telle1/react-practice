import './App.css';
import React, { useReducer, useState, createContext, useContext } from 'react'


const ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  DELETE_TODO: 'DELETE_TODO',
  COMPLETE: 'COMPLETE',
  EDIT: 'EDIT',
  SAVE_EDIT: 'SAVE_EDIT'
}

function reducer(state, action){
  switch(action.type){
    case ACTIONS.ADD_TODO:
      return [...state, {id: Date.now(),name: action.payload, complete: false, edit: false}]
    case ACTIONS.DELETE_TODO:
      const toDelete = state.filter(todo => todo.id !== action.payload.id)
      return toDelete
    case ACTIONS.COMPLETE:
      return state.map(todo => {
        if (todo.id === action.payload.id){
          return {...todo, complete: !todo.complete}
        }
      })
    case ACTIONS.EDIT:
      return state.map(todo => {
        if (todo.id === action.payload.id){
          return {...todo, edit: !todo.edit}
        }
      })
    case ACTIONS.SAVE_EDIT:
      return state.map(todo => {
        if (todo.id === action.payload.id){
          return {...todo, edit: !todo.edit, name: action.payload.change}
        }
      })
    default:
      return state
  }
}

const TodoContext = createContext();

export function ToDoProvider(props){

  const [todos, dispatch] = useReducer(reducer, [])

  return (
    <TodoContext.Provider value={{todos, dispatch}}>
      {props.children}
    </TodoContext.Provider>
  )
}



function App() {
  const [input, setInput] = useState("")
  const {todos, dispatch} = useContext(TodoContext);

  return (
    <div className="App">
      <input type="text" onChange={(e) => setInput(e.target.value)}></input>
      <button onClick={()=>dispatch({type: ACTIONS.ADD_TODO, payload: input})}>Add To Do</button>
      <p>All my Todos</p>
      {todos.map(todo => <Todo todo={todo}/>)}
    </div>
  );
}

function Todo({todo}){

  const [edit, setEdit] = useState(todo.name)
  const {dispatch} = useContext(TodoContext);

  return (
    <span style={{color: todo.edit ? 'gray' : 'pink'}}>
      {todo.edit ? 
      <div>
        <input type="text" value={edit} onChange={(e) => setEdit(e.target.value)}></input>
        <button onClick={()=>dispatch({type:ACTIONS.SAVE_EDIT, payload: {id:todo.id, change: edit} })}>Save</button>
      </div> 
      : 
      <div>{todo.id} {todo.name} {todo.complete}
      <button onClick={()=>dispatch({type:ACTIONS.EDIT, payload: {id:todo.id} })}>Edit</button>
      <button onClick={()=>dispatch({type:ACTIONS.COMPLETE, payload: {id:todo.id} })}>Complete</button>
      <button onClick={()=>dispatch({type:ACTIONS.DELETE_TODO, payload: {id:todo.id} })}>Delete</button>
      
      </div> }

    </span>
  )
}


// function App() {
//   const [todos, setToDos] = useState([])
//   const [input, setInput] = useState("")

//   const deleteTodo = id => {
//     console.log(id, 'whats in id')
//     const deleteItem =  todos.filter(todo => todo.id !== id)
//     setToDos(deleteItem)
//   }

//   return (
//     <div className="App">
//       <input type="text" onChange={(e) => setInput(e.target.value)}></input>
//       <button onClick={() => setToDos([...todos, {id: Date.now(), name: input, complete: false}])}>Add To Do</button>
//       <p>All my Todos</p>
//       {todos.map(todo => <Todo key={todo.id} todo={todo} deleteTodo={deleteTodo}/>)}
//     </div>
//   );
// }

// function Todo({todo, deleteTodo}){
//   return (
//     <span style={{color: todo.complete ? 'gray' : 'pink'}}>
//       {todo.id} {todo.name} {todo.complete}
//       <button>Complete</button>
//       <button onClick={()=>deleteTodo(todo.id)}>Delete</button>
//     </span>
//   )
// }

export default App;



