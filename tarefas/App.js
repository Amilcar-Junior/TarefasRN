import React, { useState , useCallback, useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar , FlatList , Modal} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App(){
  
  const[task, setTask] = useState([]);

  const[open, setOpen] = useState(false);
  
  const[input, setInput] = useState('');
 
  
//Buscando todas tarefas ao iniciar app  
useEffect(()=> {
  async function loadTasks(){
    const taskStorage = await AsyncStorage.getItem('@task');

    if(taskStorage){
      setTask(JSON.parse(taskStorage));
    }
  }

  loadTasks();

}, []);

//Salvando caso tena alguma tarefa alterada
useEffect(()=> {
  async function saveTasks(){
    await AsyncStorage.setItem('@task', JSON.stringify(task));
  }

  saveTasks();

},[task]);

function handleAdd(){
  if(input == '') return;

  const data = {
    key: input,
    task: input
  };

  setTask([...task,data]);
  setOpen(false);
  setInput('');
}

const handleDelete = useCallback((data)=>{
  const find = task.filter(r => r.key !== data.key);
  setTask(find);
})
  
  return(
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor = "#171d31" barStyle="light-content"/>
      <View>
        <Text style={styles.title}> Minhas Tarefas </Text>
      </View>

      {/*Lista de tarefas feito no src/components/tasklist/index.js*/}
      <FlatList
      marginHoeizontal={10}
      showsHorizontalScrollIndicator={false}
      data={task}
      keyExtractor={ (item) => String(item.key)}
      renderItem={ ({ item }) => <TaskList data= {item} handleDelete={handleDelete} /> }
      />

      {/*nova tela de registro de tarefas*/}
      <Modal animationType='slide' transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
            onPress={ () => setOpen(false) }
            >
              <Ionicons style={{marginLeft:5, marginRight:5}} name="md-arrow-back" size={30} color= "#fff"/>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova tarefa</Text>
          </View>

          <Animatable.View style={styles.modalBody} animation='fadeInUp' useNativeDriver>
            <TextInput
            multiline={true}
            placeholderTextColor="#747474"
            placeholder="O que precisa fazer hoje?"
            style={styles.input}
            value={input}
            onChangeText={ (texto) => setInput(texto)}

            />
            <TouchableOpacity style={styles.handleAdd} onPress={ handleAdd}>
              <Text style={styles.handleTextAdd}>Registrar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </Modal>

    {/*botao (+) de ir para tela deregistro de atividades*/}
      <AnimatedBtn 
      style={styles.fab}
      useNativeDriver
      animation="bounceInUp"
      duration={1500}
      onPress={ () => setOpen(true) }
      >
        <Ionicons name="ios-add" size={35} color="#FFF"/>
      </AnimatedBtn>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#171d31',

  },

  title:{
    marginTop:25,
    textAlign: 'center',
    color: '#fff',
    fontSize: 25,
    paddingBottom: 10,
    

  },

  fab:{
    position : 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0094FF',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity:0.2,
    shadowOffset:{
      width: 1,
      height:3,
    }
  },

  modal:{
    flex:1,
    backgroundColor:'#171d31',
  },

  modalHeader:{
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },

  modalTitle:{
    marginLeft:15,
    fontSize:23,
    color: '#fff',

  },

  input:{
    fontSize:20,
    marginLeft:10,
    marginRight:10,
    marginTop: 30,
    backgroundColor: '#fff',
    padding:9,
    height: 200,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 10,
  },

  handleAdd:{
    backgroundColor:'#fff',
    alignItems: 'center',
    
    padding: 15,
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    borderRadius: 10,
    
  },

  handleTextAdd:{
    fontSize: 20,

  }
});