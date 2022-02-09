import React, { useEffect, useState } from 'react';
import axios from "axios"
import "./home.css"

export default function Home() {
    const [state, setState] = useState([]);
    const [searchByName, setSearchByName] = useState([]);
    //const [searchByNameInput, setSearchByNameInput] = useState("");


    useEffect(()=>{
        axios.get("https://api.hatchways.io/assessment/students")
        .then(res=>{
            console.log(res.data)
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
        console.log(array)
        if(e.target.value === ""){
            setSearchByName(state)
        } else {
            setSearchByName(array)
        }
    }


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
                    
                </li> 
            })}
      </ul>
      

  </div>;
}
