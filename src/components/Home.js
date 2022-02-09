import React, { useEffect, useState } from 'react';
import {BsPlusLg} from "react-icons/bs"
import {BiMinus} from "react-icons/bi"
import axios from "axios"
import "./home.css"

export default function Home() {
    const [state, setState] = useState([]);
    const [searchByName, setSearchByName] = useState([]);
    const [tag, setTag] = useState("");


    useEffect(()=>{
        axios.get("https://api.hatchways.io/assessment/students")
        .then(res=>{
            //setState(res.data.students);
            //setSearchByName(res.data.students);

            const newArr = res.data.students.map(student => {  
                return {...student, tags: []};
            });
            setSearchByName(newArr);
            setState(newArr);

        }).catch(err=>console.log(err))

    }, [])

    const HandleNameSearch = (e) => {
        let array = [];
        let search;
        let studentFirstName;
        let studentLastName;
        for (let i =0; i<state.length; i++){
            search = e.target.value.toUpperCase();
            studentFirstName = state[i].firstName
            studentLastName = state[i].lastName
            if(studentFirstName.toUpperCase().indexOf(search)===0){
                console.log("new")
                console.log(studentFirstName)
                console.log(studentLastName)
                array.push(state[i])
            }
            if(studentLastName.toUpperCase().indexOf(search)===0){
                array.push(state[i])
            }
            
        }
        
        if(e.target.value === ""){
            setSearchByName(state)
        } else {
            setSearchByName(array)
        }
    }

    const ShowGrades = (e) => {
        if(e.target.id !== ""){

            const newArr = searchByName.map(student => {
                if (student.id === e.target.id) {
                  return {...student, clicked: true};
                }
              
                return student;
            });
            setSearchByName(newArr)
        } else {
            
            const newArr = searchByName.map(student => {
                if (student.id === e.target.parentElement.id) {
                  return {...student, clicked: true};
                }
              
                return student;
            });
            setSearchByName(newArr)
        }
        
    }

    const CloseGrades = (e) => {
        if(e.target.id !== ""){
            const newArr = searchByName.map(student => {
                if (student.id === e.target.id) {
                  return {...student, clicked: false};
                }
              
                return student;
            });
            setSearchByName(newArr)
        } else {
            
            const newArr = searchByName.map(student => {
                if (student.id === e.target.parentElement.id) {
                  return {...student, clicked: false};
                }
              
                return student;
            });
            setSearchByName(newArr)
        }
    }

    const HandleTag = (e) => {
        setTag(e.target.value)
    }

    const HandleKeyboardEvent = (e) => {
        if(e.key === "Enter"){
            const newArr = searchByName.map(student => {
                if (student.id === e.target.id) {
                return {...student, tags: [...student.tags, e.target.value]};
                }
            
                return student;
            });
            setSearchByName(newArr)
            setTag("")
        }
        
    }

    const HandleTagSearch = (e) => {
        
    }

    console.log(searchByName)
  return <div>
      <input onChange={HandleNameSearch} className='name-input' placeholder='Search by name'/>
      <hr/>
      <input onChange={HandleTagSearch} className='tag-search-input' placeholder='Search by tag'/>
      <hr/>
      <ul>
          {searchByName.map(student=>{
            return <li key={student.id} className="list-item">
                    <img src={student.pic} alt="student-pic"></img>
                    <div className='info-box'>
                        <h1 style={{fontFamily:"Raleway"}}>{student.firstName.toUpperCase()}&nbsp;{student.lastName.toUpperCase()}</h1>
                        <div className='info-items'>
                            <span>Email: {student.email}</span>
                            <br />
                            <span>Company: {student.company}</span>
                            <br />
                            <span>Skill: {student.skill}</span>
                            <br />
                            <span>Average: {
                                student.grades.reduce((accumulator, curr) => Number(accumulator) + Number(curr))/student.grades.length
                            }%</span>
                            <ul style={{marginTop:"1rem"}}>
                                {student.clicked && student.grades.map((grade,index)=>{
                                    return <li key={index}>
                                        Test&nbsp;{index+1}:&nbsp; {grade}%
                                    </li>
                                })}
                            </ul>
                            <ul className='tags-list'>
                                {student.tags.length !== 0 && student.tags.map((tag,index)=>{
                                    return <li key={index} className="tag-item">
                                        {tag}
                                    </li>
                                })}
                            </ul>
                            <input onChange={HandleTag} onKeyPress={HandleKeyboardEvent} value={tag} type="text" placeholder='Add a tag' className='tag' id={student.id}/>
                            
                        </div>
                        
                    </div>
                    {student.clicked ? <button id={student.id} onClick={CloseGrades} className="plus-button">
                        <BiMinus id={student.id} style={{fontSize:"50px"}}/>
                    </button>
                    : 
                    <button id={student.id} onClick={ShowGrades} className="plus-button">
                        <BsPlusLg id={student.id} style={{fontSize:"50px"}}/>
                    </button>}
                    
                    
                    
                </li> 
            })}
      </ul>
      

  </div>;
}
