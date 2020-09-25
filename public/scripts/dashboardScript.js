class DashBoardForm extends React.Component {
    
    state = {
        entries: [{exercise:"", sets:"", reps:"", weight:"", rpe:"" }],
        block: "",
        week: "",
        day: "",
        completed: new Date()
    }

    handleChange = (e) => {
        if (["exercise", "sets", "reps", "weight", "rpe"].includes(e.target.className) ) {
            let entries= [...this.state.entries]
            entries[e.target.dataset.id][e.target.className] = e.target.value.toUpperCase()
            this.setState({ entries }, () => console.log(this.state.entries))
        } else {
            this.setState({ [e.target.name]: e.target.value.toUpperCase() })
        }
        }

    addEntry = (e) => {
        this.setState((prevState) => ({
            entries: [...prevState.entries, {exercise:"", sets:"", reps:"", weight:"", rpe:""}],
        }));
        e.preventDefault() 
        }
    
    render() {
        let {entries,block,week,day,completed} = this.state
        return (
            <form onChange={this.handleChange} action="/log/react" method="POST">
            <table>
                <caption>Session Overview</caption>
                <tr>
                <td> 
                    <label htmlFor="block">Block</label>
                    <input type="text" name="block" id="block" value={block} /> 
                </td>
                <td> 
                    <label htmlFor="week">Week</label>
                    <input type="text" name="week" id="week" value={week} /> 
                </td>
                <td> 
                    <label htmlFor="day">Day</label>
                    <input type="text" name="day" id="day" value={day} /> 
                </td>
                <td> 
                    <label htmlFor="completed">Date Completed</label>
                    <input type="date" name="completed" id="completed" value={completed} /> 
                </td>
                </tr>

            </table>


            <table>
                <caption>Session Details</caption>
                <tr>  
                <td colspan="5"> 
                    <label for="notes">Notes:</label>
                    <textarea id="notes" name="notes" cols="75" rows="3" required>Squats felt good!</textarea> 
                </td>
                </tr>
                {
                entries.map((val, idx)=> {
                    let exerciseId = `exercise-${idx}`, setId = `set-${idx}`, repId = `rep-${idx}`, weightId = `weight-${idx}`, rpeId = `rpe-${idx}`
                    return (
                    <div key={idx}>
                        <tr> 
                            <td>
                                <label htmlFor={exerciseId}>{`Exercise #${idx + 1}`}</label>
                                <input
                                type="text"
                                name={exerciseId}
                                data-id={idx}
                                id={exerciseId}
                                value={entries[idx].exercise} 
                                className="exercise"
                                />
                            </td>
                            <td>
                                <label htmlFor={setId}>Sets</label>
                                <input
                                type="text"
                                name={setId}
                                data-id={idx}
                                id={setId}
                                value={entries[idx].sets} 
                                className="sets"
                                />
                            </td>
                            <td>
                                <label htmlFor={repId}>Reps</label>
                                <input
                                type="text"
                                name={repId}
                                data-id={idx}
                                id={repId}
                                value={entries[idx].reps} 
                                className="reps"
                                />
                            </td>
                            <td>
                                <label htmlFor={weightId}>Weight</label>
                                <input
                                type="text"
                                name={weightId}
                                data-id={idx}
                                id={weightId}
                                value={entries[idx].weight} 
                                className="weight"
                                />
                        </td>
                            <td>
                                <label htmlFor={rpeId}>RPE</label>
                                <input
                                type="text"
                                name={rpeId}
                                data-id={idx}
                                id={rpeId}
                                value={entries[idx].rpe} 
                                className="rpe"
                                />
                            </td>
                        </tr>  
                    </div>
                    )
                })
                }
                <tr>
                <td> <button onClick={this.addEntry}>Add new entry</button> </td>
                </tr>
                <tr>
                <td> <input type="submit" value="Submit" />  </td>
                </tr>
            </table>
            </form>
        )
        }
    }
    
ReactDOM.render(<DashBoardForm />, document.getElementById('containerDashBoard'));
