import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState<any[]>([])
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [responseMessages, setResponseMessages] = useState<any[]>([])

  useEffect(()=>{
    fetchData()
  },[])

  useEffect(()=>{
    console.log(data)
  },[data])

  async function fetchData(){
    const response = await fetch('http://localhost:3000/api/members')
    const responseJosn = await response.json()
    setData(responseJosn)
  }

  async function newMember(){
    const requestData = {
      gender: gender,
      name: name,
      birth_date: birthDate
    }

    const response = await fetch('http://localhost:3000/api/members', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(requestData)})
    const responseJson = await response.json()
    if(responseJson.message){
      setResponseMessages(responseJson.message)
    }
    else{
      setResponseMessages(["Sikeres tagfelvétel!"])
    }

    fetchData();
  }

  async function payMembership(id: any){
    const response = await fetch(`http://localhost:3000/api/members/${id}/pay`, {method: 'POST'})
    const responseJson = await response.json()
    setResponseMessages(["Sikeres fizetés!"])
    if(responseJson.status === 409){
      setResponseMessages(["Már fizetve"])
    }
    if(responseJson.status === 400){
      setResponseMessages(["Nincs ilyen felhasználó"])
    }
  }

  return (
    <div className="App">
      <header>
        <a href="https://www.petrik.hu">Petrik honlap</a> <span> </span> <a href="#newmember">Új tag felvétele</a>
        <h1>Petrik könyvklub</h1>
      </header>
      <main>
        
        <div className='container'>
        {responseMessages.map(
          x =>
          <p>{x}</p>
        )}
          <div className="row">
            {data.map(x =>
              <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 card'>
                  <h1>
                    {x.name}
                  </h1>
                  <p>
                    Született: {x.birth_date.split('T')[0]}
                    <br />
                    Csatlakozott: {x.created_at.split('T')[0]}
                  </p>
                  <img src={x.gender == 'F' ? 'assets/female.png' : x.gender == 'M' ? 'assets/male.png' : 'assets/other.png' } alt="" />

                  <button className='btn btn-dark' onClick={()=>{payMembership(x.id)}}>Tagdíj fizetés</button>
              </div>
            )}
          </div>
        </div> 

        <div id="newmember" className='container'>
              <label>Név: </label>
              <input type="text" onChange={(e) => {setName(e.target.value)}}/>
              <br />
              <label>Születési dátum: </label>
              <input type="date" onChange={(e) => {setBirthDate(e.target.value)}}/>
              <br />
              <label>Nem: </label>
              <select name="" id="" onChange={(e) => {setGender(e.target.value)}}>
                <option value="F">Nő</option>
                <option value="M">Férfi</option>
              </select>
              <br />
              <button className='btn btn-dark' onClick={newMember}>Tagfelvétel</button>
        </div>
      </main>

      <footer>
        Készítette: Én
      </footer>
    </div>
  );
}

export default App;
