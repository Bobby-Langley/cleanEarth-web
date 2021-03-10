export const submitForm = (event, fields, setResponseMessage, user, history, mode, id) => {
  const callEndpoint = mode === 'update' ? `https://us-central1-cleanearth-api.cloudfunctions.net/app/events/${id}` : "https://us-central1-cleanearth-api.cloudfunctions.net/app/events"
  const callMethod = mode === 'update' ? "PATCH" : "POST"  
  
  const formValues = {}

  fields && fields.forEach((field) => formValues[field.name[0]] = field.value)

  if (!user) {
    return null;
  }

  formValues.userId = user.uid
  formValues.createdBy = user.displayName
  formValues.hostedBy = user.displayName

  console.log({formValues})

  fetch(
    callEndpoint,
    {
      method: callMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  )
    .then((result) => result.json())
    .then((data) => {
      if (data.statusCode < 300) {
        console.log({data})
          history.push(`/event-form/update/${data.event.id}`)
          setResponseMessage(data.message)
         
       } else{ console.log("error");}
      
    })
    .catch((error) => console.log("error", error));
  // event.preventDefault();
};


export function getSingleEvent(id, setEvent) {
  console.log({id})
  fetch(`https://us-central1-cleanearth-api.cloudfunctions.net/app/event/${id}`)
      .then(res => res.json())    
      .then(data => setEvent(data))
      .catch(error => console.log(error))
}
