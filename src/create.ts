function create() {
    return {
        create: async function(){
            try{
                console.log("Deu certo")
                //const { data } = await axios.post("http://localhost:3000/users")
                //console.log(data)
            }catch(error){
                console.log(error)
            }
        }
    }
}

window.create = create