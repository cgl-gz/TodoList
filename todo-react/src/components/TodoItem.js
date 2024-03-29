import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import TodoApi from '../api/todo'

class TodoItem extends Component {
    constructor(props) {
        super(props)
        this.api = new TodoApi()
        let { task, id, done } = this.props.todo
        this.state = {
            // 使用 editing 这个变量管理正在编辑/非编辑的状态
            // 这个是 react 应用的常见解决思路, 即通过 state 的变化来改变 UI
            editing: false,
            text: task,
            todo: {
                task,
                id,
                done,
            }
        }
    }

    onEdit = () => {
        this.setState({
            editing: true,
        })
    }

    onDelete = () => {
        let { id } = this.state.todo
        let todoId = String(id)
        this.api.delete(todoId, (r) => {
            this.props.onDelete(id)
        })
    }

    updateTodo(todoId, data) {
        this.api.update(todoId, data, (r) => {
            this.setState({
                todo: r,
                editing: false,
            })
            this.updateCounter()
        })
    }

    onSubmit = () => {
        let { id } = this.state.todo
        let text = this.state.text
        let todoId = String(id)
        let data = {
            task: text
        }
        this.updateTodo(todoId, data, )
    }

    onCancel = () => {
        this.setState({
            editing: false,
        })
    }

    onChange = (e) => {
        this.setState({
            text: e.target.value,
        })
    }

    updateCounter() {
        let func = this.props.onUpdate
        func(this.state.todo)
    }

    toggleComplete = () => {
        let { id, done } = this.state.todo
        let data = {
            done: !done,
        }
        let todoId = String(id)
        this.updateTodo(todoId, data)
    }

    render() {
        let {id, task, done} = this.state.todo
        let todo = null
        // 正在编辑的时候是一个组件
        // 完成编辑的时候是另一个组件
        if (this.state.editing) {
            todo = (
                <div className='todo'>
                    <span className='material-icons'>edit</span>
                    <button  className='material-icons' onClick={this.onSubmit}>save</button>
                    <button  className='material-icons' onClick={this.onCancel}>cancel</button>
                    <input type="text" value={this.state.text} onChange={this.onChange}/>
                </div>
            )
        } else {
            let text = this.state.todo.done ? 'turned_in' : 'turned_in_not'
            todo = (
                <div className='todo'>
                    <span className='material-icons'>assignment</span>
                    <button className='material-icons' onClick={this.onEdit}>edit</button>
                    <button className='material-icons' onClick={this.onDelete}>delete</button>
                    <button className='material-icons' onClick={this.toggleComplete}>{text}</button>
                    {/*todo 的详细信息*/}
                    <Link to={`/todo/${id}`}>{task}</Link>
                </div>
            )
        }
        let cls = done ? 'todo-complete' : ''
        return (
            <div className={`todo-cell ${cls}`}>
                {todo}
            </div>
        )
    }
}

export default TodoItem
