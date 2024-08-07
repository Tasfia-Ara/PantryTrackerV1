'use client'
import Image from "next/image";
import * as dotenv from 'dotenv'
dotenv.config()
import {OpenAI} from 'openai'
import {useState, useEffect, React, useRef, useCallback} from 'react' //state variables and client-sided functions used from react
import {firestore} from '@/firebase' // imported from firebase file
import {Box, Modal, Typography, Stack, TextField, Button, Grid} from '@mui/material'
import Webcam from 'react-webcam'
import {collection, deleteDoc, doc, getDocs, getDoc, query, setDoc} from 'firebase/firestore'


const openai = new OpenAI({apiKey:"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", dangerouslyAllowBrowser: true})
//function to process the image
async function processImageOpenAI(base64encoded){
  const response = openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: "Create a JSON structure for all the items in the image. Return only the name of the object, delete any other JSON format." },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64${base64encoded}`,
            },
          },
        ],
      },
    ],
  });
  console.log(response.choices[0]);
}
export default function Home() {
  const webRef = useRef(null)
  const [imgSrc, setImgSrc] = useState([])
  const [inventory, setInventory] = useState([]) // state variable to store inventory
  const [open, setOpen] = useState(false) // state variables for button to add and remove stuff
  const [itemName, setItemName] = useState('') //item names --> stores name of the item, default is an empty string
  const updateInventory = async () => {
    //want to make this async --> fetch data from firebase but won't block code during the process
    //website won't freeze when fetching data
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
   
  }
  //cameraComponent
  const capture = useCallback(() => {
    const imageSrc = webRef.current.getScreenshot()
    setImgSrc(imageSrc)
    response = processImageOpenAI(imageSrc)
    console.log(response)
  }, [webRef, setImgSrc]
);
  
  
  
  // function to add item to inventory
  const addItem = async(item)=>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data() //getting quantity from the data
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }
  //function to delete all items from inventory
  const deleteAll = async() =>{
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    docs.forEach((document)=>{
      const docRef = doc(collection(firestore, 'inventory'), document.id)
      deleteDoc(docRef)
      updateInventory()
      
    })
  }
  
  //function to remove an item from inventory
  const removeItem = async(item)=>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const {quantity} = docSnap.data() //getting quantity from the data
      if (quantity == 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})

      }
      
    }
    await updateInventory()
  }
  const handleOpen = () => setOpen(true) //function to open
  const handleClose = () => setOpen(false) //function to close
  

  useEffect(()=>{
    updateInventory()
   
  }, [])
  
  return (
    
    <Box width='100vw'
    height='100vh'
    display='flex'
    flexDirection='column'
    justifyContent="center"
    alignItems="center"
    gap={2}> 
    <Modal 
    open={open}
    onClose={handleClose}>
      <Box
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      width={400}
      bgcolor="white"
      border="2px solid black"
      boxShadow={24}
      p={4}
      display="flex"
      flexDirection="column"
      gap={3}
      sx={{
        transform: "translate(-50%, -50%)"
      }}>
        <Typography variant='h6' alignItems="center" justifyContent='center' display="flex" color='#333'>Add an item manually</Typography>
          <Stack width='100%'direction='row'spacking={2}>
            <TextField 
            variant='outlined'
            fullWidth
            value={itemName}
            onChange={(e)=>{
              setItemName(e.target.value)
            }}>
            </TextField>
            <Button
            variant='outlined'
            onClick={()=>{
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>
              Add

            </Button>
          </Stack>
        
        <Typography variant='h6' alignItems="center" justifyContent='center' display="flex" color='#333'>
          Or take a picture</Typography> 
          <Webcam ref={webRef} 
          audio={false}
          //screenshotFormat="image.png"
          />
        <Button variant='contained'onClick={()=>{capture}}>
          Capture Photo</Button>
          {imgSrc && (
            <img
            src={imgSrc}
            />
          )}
          
        
      </Box>
    </Modal>
    <Grid item xl={2} lg={2} md={2} sm={12} xs={12} container spacing={2} justify="space-between">
      <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <Button variant='outlined' onClick={()=>{
                      handleOpen()
                    }}>
                        Add Item
                    </Button>
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <Button variant='contained' onClick={()=>{
                      deleteAll()
                    }
                      }>
                        Delete All
                    </Button>
      </Grid>
      </Grid>

      
      <Box border='1px solid #333'>
        <Box width='800px'
        height='100px'
        bgcolor='#ADD8E6' 
        display='flex'
        alignItems='center'
        justifyContent='center'>
          <Typography variant='h2' color='#333'
          >Inventory Items
          </Typography>
        </Box>
        
      
      <Stack 
      width='100%'
      height='300px'
      spacing={2}
      overflow="auto"
      >
        {inventory.map(({name, quantity})=>(
            <Box 
            key={name} 
            width='100%' 
            minHeight='150px'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            bgColor='#f0f0f0'
            padding={5}
            >
              <Typography variant='h3'color='#333' textAlign='center'>
                {name.charAt(0).toUpperCase() + name.slice(1)} 
              </Typography>
              <Typography variant='h3'color='#333' textAlign='center'>
                {quantity} 
              </Typography>
              <Button
              variant="contained"
              onClick={()=>{
                removeItem(name)
              }}
              >Remove</Button>
            </Box>
        ))
        }

      </Stack>
      </Box>
    </Box> //most basic starting block, 100vw --> 100% width of the components
  );
}

