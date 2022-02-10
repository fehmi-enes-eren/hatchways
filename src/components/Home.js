import React, { useEffect, useState } from 'react';
import {BsPlusLg} from "react-icons/bs"
import {BiMinus} from "react-icons/bi"
import axios from "axios"
import "./home.css"

export default function Home() {
    const [state, setState] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchItems, setSearchItems] = useState({name:"",tag:""});
    const [tag, setTag] = useState({tag:"",id:""});


    useEffect(()=>{
        axios.get("https://api.hatchways.io/assessment/students")
        .then(res=>{
            //setState(res.data.students);
            //setSearchResults(res.data.students);

            const newArr = res.data.students.map(student => {  
                return {...student, tags: []};
            });
            setSearchResults(newArr);
            setState(newArr);

        }).catch(err=>console.log(err))

    }, [])

    const HandleSearch = (e) => {
        let array = [];
        let search;
        let studentFirstName;
        let studentLastName;
        let searchTag;


        if(e.target.id === "name-search"){
            setSearchItems({name:e.target.value, tag:""})
            for (let i =0; i<state.length; i++){
                search = e.target.value.toUpperCase();
                studentFirstName = state[i].firstName;
                studentLastName = state[i].lastName;

                if(studentFirstName.toUpperCase().indexOf(search)===0){
                    array.push(state[i])
                    
                }
                if(studentLastName.toUpperCase().indexOf(search)===0){
                    array.push(state[i]);
                    
                }
            }
            if(e.target.value === ""){
                setSearchResults(state)
            }else {
                setSearchResults(array)
            }

        } else {
            setSearchItems({tag:e.target.value, name:""})
            for (let i =0; i<state.length; i++){
                search = e.target.value.toUpperCase();
                searchTag = state[i].tags;
                for(let j =0; j<searchTag.length; j++){

                    if(searchTag[j].toUpperCase().indexOf(search)===0){
                        array.push(state[i]);
                        // setSearchResults([...searchResults, state[i]])
                    }
                }    
            }


            if(e.target.value === ""){
                setSearchResults(state)
            }else {
                const ids = array.map(o => o.id)
                const filtered = array.filter(({id}, index) => !ids.includes(id, index + 1))
                setSearchResults(filtered)
            }
        }
  
    }
    
    console.log(searchResults)
    const ShowGrades = (e) => {
        if(e.target.id !== ""){

            const newArr = searchResults.map(student => {
                if (student.id === e.target.id) {
                  return {...student, clicked: true};
                }
              
                return student;
            });
            setSearchResults(newArr)
        } else {
            
            const newArr = searchResults.map(student => {
                if (student.id === e.target.parentElement.id) {
                  return {...student, clicked: true};
                }
              
                return student;
            });
            setSearchResults(newArr)
        }
        
    }

    const CloseGrades = (e) => {
        if(e.target.id !== ""){
            const newArr = searchResults.map(student => {
                if (student.id === e.target.id) {
                  return {...student, clicked: false};
                }
              
                return student;
            });
            setSearchResults(newArr)
        } else {
            
            const newArr = searchResults.map(student => {
                if (student.id === e.target.parentElement.id) {
                  return {...student, clicked: false};
                }
              
                return student;
            });
            setSearchResults(newArr)
        }
    }

    const HandleTag = (e) => {
        setTag({
            tag: e.target.value,
            id:e.target.id
        })
    }

    const HandleKeyboardEvent = (e) => {
        if(e.key === "Enter" && tag !== ""){
            const newArr = searchResults.map(student => {
                if (student.id === e.target.id) {
                return {...student, tags: [...student.tags, e.target.value]};
                }
            
                return student;
            });
            setSearchResults(newArr)
            setState(newArr)
            setTag("")
        }
        
    }


    //console.log(searchResults);
  return <div>
      <input onChange={HandleSearch} value={searchItems.name} className='name-input' name="name" id="name-search" placeholder='Search by name'/>
      <hr/>
      <input onChange={HandleSearch} value={searchItems.tag} className='tag-search-input' name="tag" id='tag-search' placeholder='Search by tag'/>
      <hr/>
      <ul>
          {searchResults.map(student=>{
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
                            <input onChange={HandleTag} onKeyPress={HandleKeyboardEvent} value={tag.id === student.id ? tag.tag : ""} type="text" placeholder='Add a tag' className='tag' id={student.id}/>
                            
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
