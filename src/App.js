import React,{useState} from 'react';
import logo from './logo.svg';
import 'react-bootstrap';
import {Link} from 'react-router-dom';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function useForceUpdate(){
  const [value, set] = useState(true); //boolean state
  return () => set(!value); // toggle the state to force render
}
function App() {
  var [itr,setItr]=useState(0);
  var [idGen,setId] = useState(100);
  var [count,setCount] = useState([]); 
  const [name,setName] = useState('');
  const [title,setTitle] = useState('');
  const [desc,setDesc] = useState('');
  const [comment,setComment] = useState('');
  const [modal,setModal] = useState(false);
  const [board,setBoard] = useState(false);
  const [bname,setBname] = useState('');
  const [cardModal,setCardModal] = useState(false);
  const [cardModalEdit,setCardModalEdit] = useState(false);
  const [listId,setListId] = useState(false);
  const [listIndex,setListIndex] = useState();
  const [listPresent,setPres] = useState();
  const [cardPresent,setPresCard] = useState();
  const [ disableField,setdisableField] = useState(true);
  const [ editList,setEditList] = useState(false);


  function toggle() {
      setModal(!modal)
  }
  function editLists(item,index) {
    toggle();
    setName(item.name)
    setEditList(true)
    setListIndex(index);
}

  function toggleBoard() {
    setBoard(!board)
  }
  function toggleCard(event) {
    setCardModal(!cardModal)
    if(event && event.target && event.target.id)
     setListId(event.target.id);
}
function toggleCardEdit(card,edit,listId,cardId) {
 let disable = edit?false:true;
 setdisableField(disable)

  setCardModalEdit(!cardModalEdit);
  if(card){
  setTitle(card.title);
  setDesc(card.description);
  setComment(card.comment);
  }
  if(listId>=0 && cardId>=0) {
    setPres(listId);
    setPresCard(cardId);
  }
}

function editCard() {
let items = [...count];
let id = items[listPresent].cards[cardPresent].id;

let obj ={title:title,description:desc,comment:comment,id:id};
items[listPresent].cards[cardPresent] = obj;
setCount(items);
toggleCardEdit();

}

  function handleChangeName(event) {
    setName(event.target.value);
  }

  function handleChangeTitle(event) {
    setTitle(event.target.value);
  }

  function handleChangeDesc(event) {
    setDesc(event.target.value);
  }

  function handleChangeComment(event) {
    setComment(event.target.value);
  }
  function handleChangeBoard(event) {
    setBname(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
     }
  function addBoard(event) {
     toggleBoard();
  }  
  
  function deleteList(list){
    let items = [...count];
    items.splice(list,1);
    setCount(items);
  }
  
  function deleteCard(list,card){
    let items = [...count];
    items[list].cards.splice(card,1);
    setCount(items);
    
  }   

  var newCount=[];
  function addList(){
    toggle();
    if(!editList) {
      setItr(itr+1);
      var newObj = {counter: itr ,cards:[],name:name};
      newCount=count.concat(newObj);
      setCount(newCount);
      setName('');
    }
    else {
      let items = [...count];
     let  obj = {counter:items[listIndex].counter,cards:items[listIndex].cards,name:name}; 
      items[listIndex] = obj;
      setCount(items);
    }
  }

  function addCard(event){
    toggleCard();
    let items = [...count];
    let indexFound;
    items.find((item,index) => {
      if(item.counter == parseInt(listId)) {
        indexFound =  index;
      }
  })
    let item = {...items[indexFound]};
    setId(idGen-1);
    item.cards.push({title:title,description:desc,comment:comment,id:idGen});
    items[indexFound] = item;
    setCount(items);
    setTitle('');
    setCardModal(false);
    setDesc('');
    setComment('');
    setListId('');
  }
 
  const forceUpdate = useForceUpdate();
  function allowDrop(event) {
    event.preventDefault();
  }
  
  function drag(event) {
    var obj = JSON.stringify({id:event.target.id,className:event.target.className?event.target.className:''});
    event.dataTransfer.setData("text",obj );
  }

  function dragCards(event) {
    var obj = JSON.stringify({id:event.target.id,className:event.target.className?event.target.className:''});
    event.dataTransfer.setData("text",obj );
  }
  
  function drop(event,index) {
    event.preventDefault();
    var data = JSON.parse(event.dataTransfer.getData("text"));
    if(data.className && data.className.indexOf("recipe")==-1) {
        let items = count;
        let dropIndex,dragIndex,checkId,droppedOverEmptyList;
        if(event.target.className.indexOf('flex')>-1){
          droppedOverEmptyList=true;
        }
        if(droppedOverEmptyList) {
          checkId = event.target.id;
        }
        else {
          if(event.target.id)
            checkId = document.getElementById(event.target.id).parentElement.id;
            else{
              if(event.target.className) {
                let className=document.getElementsByClassName(event.target.className)[0].className,parent=document.getElementsByClassName(event.target.className)[0];
                while(className && className.indexOf("flex-box")==-1) {
                  className = parent.parentElement ? parent.parentElement.className : '';
                  parent = parent.parentElement;
                }
                checkId = parent.id;
              }
            }
        } 
        items.find((item,index)=>{
          if(item.counter == parseInt(checkId)) {
            dropIndex = index;
          }
          else if(item.counter == parseInt(data.id)) {
            dragIndex = index;
          }
        })
        console.log("dragIndex",dragIndex,checkId,dropIndex);
        let item = {...items[dragIndex]};
        items.splice(dragIndex,1);
        items.splice(dropIndex,0,item);
        setCount(items);
        forceUpdate();
      }
      else if(data.className && data.className.indexOf("recipe")!=-1)  {
        let items = count;
          let dropIndex,dragIndex,checkId,droppedOverEmptyList,dragListId,dropListId;
          if(data.className) {
              let className=document.getElementById(data.id).className,parent=document.getElementById(data.id);
              while(className && className.indexOf("flex-box")==-1) {
                className = parent.parentElement? parent.parentElement.className : '';
                parent = parent.parentElement;
              }
              dragListId = parent.id;
          }
          if(event.target.className && event.target.className.indexOf('flex')>-1){
            droppedOverEmptyList=true;
          }
          if(event.target.id) {
            checkId = event.target.id;
          }
          else {
            if(event.target.className) {
              console.log("event id",document.getElementsByClassName(event.target.className))
              let className=document.getElementById(event.target.id).className,parent=document.getElementById(event.target.id);
              while(className && className.indexOf("recipes-box")==-1) {
                className = parent.parentElement ? parent.parentElement.className : '';
                parent = parent.parentElement;
              }
              checkId = parent.id;
              console.log("checkId",checkId);
            }
          }
          if(!droppedOverEmptyList){
            if(event.target.className){
              let className=document.getElementById(event.target.id).className,parent=document.getElementById(event.target.id);
                while(className && className.indexOf("flex-box")==-1) {
                  className = parent.parentElement? parent.parentElement.className : '';
                  parent = parent.parentElement;
                }
                dropListId = parent.id;
              }
          } 
          else {
            dropListId = event.target.id;
          }
              items[dragListId].cards.find((item,index)=>{
                if(item.id == parseInt(data.id)) {
                  dragIndex = index;
                  }
              })
              items[dropListId].cards.find((item,index)=>{
                if(item.id == parseInt(checkId)) {
                  dropIndex = index;
                }
              })
              if(!dropIndex){
                dropIndex=0;
              }
              if(!dragIndex) {
                dragIndex = 0;
              }
          let dragItem = [...items[dragListId].cards];
          let dropItem = [...items[dropListId].cards];
          if(dragIndex>=0 && dropIndex>=0) {
            if(dropListId!=dragListId) {
              if(dragItem[dragIndex])
                items[dropListId].cards.splice(dropIndex,0,dragItem[dragIndex]);
              items[dragListId].cards.splice(dragIndex,1);
              setCount(items);
              forceUpdate();
            }
            else {
              items[dragListId].cards.splice(dragIndex,1);
              if(dragItem[dragIndex])
                items[dropListId].cards.splice(dropIndex,0,dragItem[dragIndex]);
              setCount(items);
              forceUpdate();
            }
          }
        event.stopPropagation();  
      } 
  }

  return (
  <>
  
  <div className="header" style={{position:'fixed',top:0 + 'px'}}>
       
  <li style={{marginTop: 13+'px',listStyleType: 'none',fontWeight: 'bold'}}>{bname}</li>
  <button className="btn btn-group" style={{float:'right',marginRight:10 +'px',marginTop:8+'px',backgroundColor: '#ffffff',border: 1 + 'px solid #d5dadf'}} onClick={()=>{toggle(modal)}} disabled={bname?false:true}> Add List</button>
  <button className="btn btn-group" style={{float:'right',marginRight:10 +'px',marginTop:8+'px',backgroundColor: '#ffffff',border: 1 + 'px solid #d5dadf'}}  onClick={()=>{toggleBoard(board)}}> Add Board</button>
  </div>
  <div className="fixed-page-content">
    <div className="flex-container">
      {count.map(function(item,indexList){
        return(
        <div className="flex-box"  key={item.counter} id={item.counter} onDrop={drop} onDragOver={allowDrop} draggable="true" onDragStart={drag}>
                <i className="fa fa-plus" id={item.counter} style={{float:'right',marginRight:15 +'px',marginTop:3+'px'}} onClick={toggleCard}></i>
                <i className="fa fa-trash-o" id={item.counter} style={{float:'right',marginRight:15 +'px',marginTop:3+'px'}} onClick={()=>{deleteList(indexList)}}></i>
                <i className="fa fa-edit" id={item.counter} style={{float:'right',marginRight:15+'px',marginTop:8+'px'}} onClick={()=>editLists(item,indexList)}></i>
                <span style={{float: 'left',fontSize: 20+'px',marginLeft: 7+'px',textOverflow: 'ellipsis',whiteSpace: 'nowrap',overflow: 'hidden',width: 225+'px'}}>{item.name}</span>
          {item.cards.map((card,index) => {
            return(
            <div className="recipes__box" id={card.id} key={card.id} style={{marginTop:35+'px'}} draggable = "true" onDrop={drop} onDragOver={allowDrop} onDragStart={dragCards}>
               <div className="recipe__text" id={card.id}>
               <i className="fa fa-trash-o" id={card.id+'trash'} style={{fontSize:24+'px',float:'right',color:'cadetblue',marginRight:10+'px',marginTop:10+'px'}} onClick={()=>{deleteCard(indexList,index)}}></i>
               <i className="fa fa-edit" id={card.id+'edit'} style={{fontSize:24+'px',float:'right',color:'cadetblue',marginRight:10+'px',marginTop:10+'px'}} onClick={()=>toggleCardEdit(card,true,indexList,index)}></i>
                 <h5 className="recipes__title" id={card.id+'recipes__title'} style={{width: 60+'%',overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap',color: 'cadetblue'}}>
                  {card.title}
                 </h5>
                 <p className="recipes__subtitle" id={card.id+'recipes__subtitle'}>
                   <label>Description:</label>
                   {card.description}
                 </p>
                 <p className="recipes__subtitle" id={card.id+'recipes_subtitle1'}>
                   <label>Comment:</label>
                   {card.comment}
                 </p>
               </div>
               <button className="recipe_buttons" onClick={()=>{toggleCardEdit(card)}} id={card.id+'recipe_buttons'}>
                 view more
               </button>
           </div>
            )
          })}
          
          </div>
        //  </div>
        ) 
      })}
    </div>
  </div>
  <div className="App">
    <div>
        <Modal isOpen={modal}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Enter List Name</ModalHeader>
          <ModalBody>
          <div className="row">
            <div className="form-group col-md-12">
            <label className="control-label col-md-3">List Name</label>
            <div className="col-md-8" style={{display: 'inline-block'}}>
            <input  type="text" value={name} onChange={handleChangeName} style={{outline: 0,
    borderWidth:'0 0  2' + 'px',
    borderColor: 'cadetblue'}} className="form-control" />
              </div>
            </div>  
              </div>
          </ModalBody>
          <ModalFooter>
            <input type="submit" value="Save" onClick={addList} color="primary" className="btn btn-primary" />
            <Button  onClick={toggle}>Cancel</Button>
          </ModalFooter>
          </form>
        </Modal>
        </div>
  </div>
  <div className="App">
    <div>
        <Modal isOpen={board}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Enter Board Name</ModalHeader>
          <ModalBody>
          <div className="row">
            <div className="form-group col-md-12">
            <label className="control-label col-md-4">Board Name</label>
            <div className="col-md-8" style={{display: 'inline-block'}}>
            <input  type="text" value={bname} onChange={handleChangeBoard} style={{outline: 0,
    borderWidth:'0 0  2' + 'px',
    borderColor: 'cadetblue'}} className="form-control" />
              </div>
            </div>  
              </div>
          </ModalBody>
          <ModalFooter>
            <input type="submit" value="Save" onClick={addBoard} color="primary" className="btn btn-primary" />
            <Button  onClick={toggleBoard}>Cancel</Button>
          </ModalFooter>
          </form>
        </Modal>
        </div>
  </div>
  <div className="App">
    <div>
        <Modal isOpen={cardModal} size="lg">
        <form onSubmit={handleSubmit}>
          <ModalHeader>Enter Card Details</ModalHeader>
          <ModalBody>
          <div className="row">
            <div className="form-group col-md-12">
            <label className="control-label col-md-3" style={{maxWidth:'none'}}>Card Title</label>
            <div className="col-md-8" style={{display: 'inline-block'}}>
            <input  type="text" value={title} onChange={handleChangeTitle} style={{outline: 0,
    borderWidth:'0 0  2' + 'px',
    borderColor: 'cadetblue'}} className="form-control" />
              </div>
            </div>  
            <div className="form-group col-md-12">
            <label className="control-label col-md-3" style={{maxWidth:'none'}}>Description</label>
            <div className="col-md-8" style={{display: 'inline-block'}}>
    <textarea rows="5" cols="65"  value={desc} onChange={handleChangeDesc} placeholder="Enter Card Description">
          </textarea>
              </div>
            </div> 
            <div className="form-group col-md-12">
            <label className="control-label col-md-3" style={{maxWidth:'none'}}>Comment</label>
            <div className="col-md-8" style={{display: 'inline-block'}}>
    <textarea rows="5" cols="65"  value={comment} onChange={handleChangeComment} placeholder="Enter Comment(s)">
          </textarea>
              </div>
            </div> 
              </div>
          </ModalBody>
          <ModalFooter>
            <input type="submit" value="Save" onClick={()=>{addCard()}} color="primary" className="btn btn-primary" />
            <Button  onClick={toggleCard}>Cancel</Button>
          </ModalFooter>
          </form>
        </Modal>
        </div>
  </div>
  
  <div className="App">
    <div>
        <Modal isOpen={cardModalEdit} size="lg">
        <form onSubmit={handleSubmit}>
          <ModalHeader>Enter List Name</ModalHeader>
          <ModalBody>
          <div className="row">
            <div className="form-group col-md-12">
            <label className="control-label col-md-3" style={{maxWidth:'none'}}>Card Title</label>
            <div className="col-md-8" style={{display: 'inline-block'}}>
            <input  type="text" value={title} disabled={disableField}  onChange={handleChangeTitle} style={{outline: 0,
    borderWidth:'0 0  2' + 'px',
    borderColor: 'cadetblue'}} className="form-control" />
              </div>
            </div>  
            <div className="form-group col-md-12">
            <label className="control-label col-md-3" style={{maxWidth:'none'}}>Description</label>
            <div className="col-md-8" style={{display: 'inline-block'}}>
    <textarea rows="5" cols="65"  value={desc} disabled={disableField} onChange={handleChangeDesc} placeholder="Enter Card Description">
          </textarea>
              </div>
            </div> 
            <div className="form-group col-md-12">
            <label className="control-label col-md-3" style={{maxWidth:'none'}}>Comment</label>
            <div className="col-md-8" style={{display: 'inline-block'}}>
    <textarea rows="5" cols="65"  value={comment} disabled={disableField} onChange={handleChangeComment} placeholder="Enter Comment(s)">
          </textarea>
              </div>
            </div> 
              </div>
          </ModalBody>
          <ModalFooter>
            {!disableField?<input type="submit" value="Save" onClick={()=>{editCard()}} color="primary" className="btn btn-primary" /> :''}
            <Button  onClick={toggleCardEdit}>Close</Button>
          </ModalFooter>
          </form>
        </Modal>
        </div>
  </div>
  </>
  );
}

export default App;
