import React, { useEffect, useState } from 'react';
import {BsPlusLg} from "react-icons/bs"
import {BiMinus} from "react-icons/bi"
import axios from "axios"
import "./home.css"

export default function Home() {
    const [state, setState] = useState([]);
    const [searchByName, setSearchByName] = useState([]);
    //const [searchByNameInput, setSearchByNameInput] = useState("");


    useEffect(()=>{
        axios.get("https://api.hatchways.io/assessment/students")
        .then(res=>{
            setState(res.data.students)
            setSearchByName(res.data.students)
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
            
            const result = searchByName.filter(student=>{
                return student.id === e.target.id ? student["clicked"] = true : student["clicked"] = false
            })
            
            const removeDuplicate = searchByName.filter(student=>{
                return student.id !== result[0].id
            })
            removeDuplicate.unshift(result[0])
            setSearchByName(removeDuplicate)
        } else {
            
            searchByName[e.target.parentElement.id].clicked = true;
        }
        
    }

    const CloseGrades = (e) => {
        if(e.target.id !== ""){
            
            const result = searchByName.filter(student=>{
                return student.id === e.target.id ? student["clicked"] = false : ""
            })
            const removeDuplicate = searchByName.filter(student=>{
                return student.id !== result[0].id
            })
            removeDuplicate.unshift(result[0])
            setSearchByName(removeDuplicate)
        } else {
            
            searchByName[e.target.parentElement.id].clicked = true;
        }
    }

    console.log(searchByName)
  return <div>
      <input onChange={HandleNameSearch} className='name-input' placeholder='Search by name'/>
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
