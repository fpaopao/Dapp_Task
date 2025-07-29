import "./normalize.css"
import "./todoList.css"
import classNames from 'classnames';
import {useEffect, useState} from "react";

import {v4 as uuidv4} from 'uuid';

const TodosList = () => {

  const [keyWord, setKeyWord] = useState("");
  const [list, setList] = useState([]);

  // 添加
  const addItem = (name) => {
    if (keyWord == "") {
      alert("请输入");
      return;
    }
    let a = {uuid: uuidv4(), title: keyWord, isOver: false}
    setList([...list, a])
    setKeyWord("")
  }

  // 删除
  const deleteItem = (item) => {
    const {title, uuid} = item;
    const a = list.filter((item1) => {
      return item1.uuid !== uuid
    })
    setList(a)
  }

  // 完成、取消完成
  const opeOk = (item) => {
    list.forEach((item1) => {
      if (item1.uuid == item.uuid) {
        item1.isOver = !item1.isOver;
      }
    })
    setList([...list])
  }

  // 编辑
  const editItem = (item) => {
    const input = window.prompt("请输入您要修改的内容:");
    if (input !== null) {
      list.forEach((item1) => {
        if (item1.uuid == item.uuid) {
          item1.title = input;
        }
      })
      setList([...list])
    } else {
      console.log("取消了输入");
    }
  }


  return (
    <div className="box">
      <div className="add-list">
        <input type="text" placeholder="请输入" value={keyWord} onChange={(e) => {
          setKeyWord(e.target.value)
        }}/>
        <button onClick={() => {
          addItem()
        }}>添加
        </button>
      </div>
      <ul>{
        list.map((item, index) => {
          return (
            <li key={item.uuid}>
              <p className={classNames('name', {
                'is-over': item.isOver,
              })}>{index + 1}、 {item.title}</p>
              <p className="cha" title="删除" onClick={() => {
                deleteItem(item)
              }}>del</p>
              <p className="ok" title="完成" onClick={() => {
                opeOk(item)
              }}>ok</p>
              <p className="ok" title="编辑" onClick={() => {
                editItem(item)
              }}>edit</p>
            </li>
          )
        })
      }
      </ul>
    </div>
  )
}

export default TodosList;