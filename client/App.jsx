import React, {useState, useEffect} from 'react'
import './styles.css'
import regeneratorRuntime from "regenerator-runtime";

//Did everything in one component because the build of the component primarily is made up of html elements

//declared all of my functions at the top to establish a "server" with "endpoints"
const fetchStudents = async () => [
  {
    "studentId": 1,
    "studentName": "Alice",
    "studentImageUrl": "https://placehold.it/300x200",
    "studentCountryImageUrl": "https://placehold.it/200x133"
  },
  {
    "studentId": 2,
    "studentName": "Bob",
    "studentImageUrl": "https://placehold.it/300x200",
    "studentCountryImageUrl": "https://placehold.it/200x133"
  },
  {
    "studentId": 3,
    "studentName": "Hellomynameisverylong",
    "studentImageUrl": "https://placehold.it/300x200",
    "studentCountryImageUrl": "https://placehold.it/200x133"
  },
  {
    "studentId": 4,
    "studentName": "Dan",
    "studentImageUrl": "https://placehold.it/300x200",
    "studentCountryImageUrl": "https://placehold.it/200x133"
  }
]

const fetchCourses = async () => [
  {
    "courseId": 1,
    "courseName": "Biology"
  },
  {
    "courseId": 2,
    "courseName": "Math"
  },
  {
    "courseId": 3,
    "courseName": "History"
  },
  {
    "courseId": 4,
    "courseName": "English"
  },
  {
    "courseId": 5,
    "courseName": "Psychology"
  }
]

const fetchGrades = async () => [
  {
    "studentId": 1,
    "courseId": 1,
    "grade": 90.1
  },
  {
    "studentId": 1,
    "courseId": 2,
    "grade": 85.6
  },
  {
    "studentId": 1,
    "courseId": 4,
    "grade": 80.4
  },
  {
    "studentId": 1,
    "courseId": 5,
    "grade": 8.5
  },
  {
    "studentId": 2,
    "courseId": 2,
    "grade": 95.2
  },
  {
    "studentId": 2,
    "courseId": 3,
    "grade": 56.5
  },
  {
    "studentId": 2,
    "courseId": 4,
    "grade": 50.2
  },
  {
    "studentId": 3,
    "courseId": 1,
    "grade": 80.2
  },
  {
    "studentId": 3,
    "courseId": 5,
    "grade": 40.2
  }
]

//used a functional component as they're more performant than class components
const App = (props) => {

  //hooks used to managed state

  //student number indicated which student I'm looking at presently inside the component
  //the argument passed into useState is the initial value
  const [studentNumber, setStudentNumber] = useState(0)

  //grades is where the grades of the individual student being looked at are stored
  const [grades, setGrades] = useState([])
  //student is where the individual student data with their demographics are stored
  const [student, setStudents] = useState({})
  //courses is where the course number to name is stored
  const [courses, setCourses] = useState([])

  //useEffect is the lifecycle method for when the component first mounts, denoted by [] for second argument
  //only needs to run once as the course data is static
  useEffect(() => {
    fetchCourses()
    .then(data => setCourses(data))
    .catch(err => console.log(err))
  }, [])

  //the second parameter for this useEffect is [studentNumber] so the contents run whenever that state changes
  //So whenever the chosen studnet changes, it makes a request to our "server" to gather the necessary data
  useEffect(() => {
    //this function grabs the singlular student data with name, photo and country flag info into state
    fetchStudents()
    .then(data => setStudents(data[studentNumber]))
    //since these are asynchronous functions, they require error-handlers, ideally the date is there to know when the error occurred
    .catch(err => console.log(err, Date.now()))
    //this function grabs the grades appropriate for the selected student and stores them in state
    fetchGrades()
    .then(data => {
      const grade = []
      //this runs through the entire data set every time assuming you don't know the contents of the data
      //could be more efficient but this works for this case
      for(let i = 0; i < data.length; i ++) {
        if (data[i].studentId === studentNumber + 1) {
          grade.push(data[i])
        }
      }
      setGrades(grade)
    })
    .catch(err => console.log(err, Date.now()))
  }, [studentNumber])

  //method attached to component to handle clicking of the selectors
  const studentSelector = e => {
    //because ids are strings, the integer needs to parsed or the fetching of data doesn't work
    setStudentNumber(parseInt(e.target.id))
  }

  //getting into JSX html data parsing into display
  //need an array to display a collection of tags
  const displayGrades = [];
  //initializing variables to be assigned in the component space to be utilized per iteration below
  let letterGrade = ""
  let cssControl;

  //needs to parse numbers to have numbers representation
  for (let i = 0; i < grades.length; i ++) {
    if (grades[i].grade > 90) {
      letterGrade = "A"
    } else if (grades[i].grade > 80) {
      letterGrade = "B"
    } else if (grades[i].grade > 70) {
      letterGrade = "C"
    } else if (grades[i].grade > 60) {
      letterGrade = "D"
    } else {
      letterGrade = "F"
    }
    //if the letter grade is F, certain CSS elements need to be changed, so that inforamtion is chosen before displaying
    if (letterGrade === "F") {
      cssControl = <span className="letterGrade fail">{`${letterGrade}`}</span>
    } else {
      cssControl = <span className="letterGrade">{`${letterGrade}`}</span>
    }
    //push into the collection, the proper html element is chosen with appropriate letter and CSS per iteration
    displayGrades.push(
      //iterating items require keys
      <div key={i} className="grades">
        <span>{`${i + 1}. ${courses[grades[i].courseId - 1].courseName}`}</span>
        <div className='breakdown'>
          {cssControl}
          <span className="numbers">{`(${grades[i].grade})`}</span>
        </div>
      </div>
    )
  }
  
  return ( 
    //ternary used here in case any failures or timeout issues with loading students data
    student ? 
    <div id="main">
      <div id="studentInfo">
        <img id="studentPicture" src={student.studentImageUrl}/>
        <div id="records">
          <h2 id ="exam">Exam Results</h2>
          <div id="name">
            <h1 id ="studentName">{student.studentName}</h1>
            <img id="studentCountry" src={student.studentCountryImageUrl}/>
          </div>
          <div id="tableTitle">
            <h3>C O U R S E S</h3>
            <h3 id ="results">R E S U L T S</h3>
          </div>
          <div id="grades">
            {displayGrades}
          </div>
        </div>
      </div>
      <div id="selector">
        <div id="buttons">
          {/*ternary used in JSX to add a class that transitions CSS for animation purposes*/}
          <div className={`selector ${studentNumber === 0 ? "selected" : ""}`} id="0" onClick={(e) => {
            studentSelector(e)
          }}/>
          <div className={`selector ${studentNumber === 1 ? "selected" : ""}`} id="1" onClick={(e) => {
            studentSelector(e)
          }}/>
          <div className={`selector ${studentNumber === 2 ? "selected" : ""}`} id="2" onClick={(e) => {
            studentSelector(e)
          }}/>
          <div className={`selector ${studentNumber === 3 ? "selected" : ""}`} id="3" onClick={(e) => {
            studentSelector(e)
          }}/>
        </div>
      </div>
    </div>:
    <h1>Unable to fetch student data</h1>
   );
}
 
export default App;