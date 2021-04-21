import React, {useState} from "react";
import './App.css';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import _ from "lodash";
import {v4} from "uuid";


function App() {
  const [text, setText] = useState();
  const [state, setState] = useState({
    "todo": {
      title: "Todo",
      items: []
    },
    "in-progress": {
      title: "In Progress",
      items: []
    },
    "done": {
      title: "Done",
      items: []
    }
  })

  const handleDragEnd = ({destination, source}) => {
    if (!destination) {
      return
    }
    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }
    // Creating a copy before removing from state
    const itemCopy = {...state[source.droppableId].items[source.index]}
    
    setState(prev => {
      prev = {...prev}
      // Remove 
      prev[source.droppableId].items.splice(source.index, 1)
      // Adding to new location
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

  const addItem = () => {
    setState(prev => {
      return {
        ...prev,
        todo: {
          title: "Todo",
          status: "todo",
          items: [
            {
            id: v4(),
            name: text
            },
          ...prev.todo.items
          ]
        }
      }
    })
    setText("");
  }

  return (
    <div className="App">
      <div>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
        <button onClick={addItem}>Add</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
      {_.map(state, (data, key) => {
      return (
       <div key={key} className={"column"}>
         <h3>{data.title}</h3>
          <Droppable droppableId={key}>
            {(provided) => {
              return(
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={"droppable-col"}
                  >
                    {data.items.map((el, index) => {
                      return (
                        <Draggable key={el.id} index={index} draggableId={el.id}>
                          {(provided, snapshot) => {
                            return(
                              <div
                              className={`item ${snapshot.isDragging && "dragging"}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              >
                                {el.name}
                              </div>
                            )
                          }}
                        </Draggable>
                      )
                      })}
                      {provided.placeholder}
                </div>
              )
            }}
          </Droppable>
        </div>
      )
    })}
      </DragDropContext>
    </div>
  );
}

export default App;
