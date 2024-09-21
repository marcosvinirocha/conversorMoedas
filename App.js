import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import PickerItem from './src/Picker';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from './src/services/api'

export default function App() {
  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0);
  const [valorMoeda, setValorMoeda] = useState('');

  const [moedaBvalor, setMoedaBvalor] = useState(0);

  useEffect(() => {
    async function loadMoedas() {

      const response = await api.get('all');
      let arrayMoedas = [];

      Object.keys(response.data).map((moeda) => {
        arrayMoedas.push({
          key: moeda,
          value: moeda,
          label: moeda,
        });
      });

      setMoedas(arrayMoedas);
      setMoedaSelecionada(arrayMoedas[0].key);
      setLoading(false);

    }

    loadMoedas();
  }, []);

  async function converter() {
    if (moedaBvalor === 0 || moedaBvalor === '' || moedaSelecionada === null) {
      return;
    }

    const response = await api.get(`/all/${moedaSelecionada}-BRL`);
    console.log(response.data[moedaSelecionada].ask)

    let resutado = (response.data[moedaSelecionada].ask * parseFloat(moedaBvalor))

    setValorConvertido(`${resutado.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`)
    setValorMoeda(moedaBvalor)
    Keyboard.dismiss();
  }

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101215' }}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.areaMoeda}>
        <Text style={styles.titulo}>Selecione sua moeda</Text>
        <PickerItem moedas={moedas} moedaSelecionada={moedaSelecionada} onChange={(moeda) => {
          setMoedaSelecionada(moeda);
        }} />
      </View>
      <View style={styles.areaValor}>
        <Text style={styles.titulo}>Digite um valor para converter em (R$)</Text>
        <TextInput style={styles.input} placeholder='0' keyboardType='numeric' value={moedaBvalor} onChangeText={(valor) => setMoedaBvalor(valor)} />
      </View>

      <TouchableOpacity style={styles.botaoArea} onPress={converter}>
        <Text style={styles.botaoTitulo}>Converter</Text>
      </TouchableOpacity>

      {valorConvertido !== 0 && (
        <View style={styles.areaResultado}>
          <Text style={styles.valorConvertido}>
            {valorMoeda}  {moedaSelecionada}
          </Text>
          <Text style={{ fontSize: 18, margin: 8, color: '#000' }}>
            Corresponde a
          </Text>
          <Text style={styles.valorConvertido}>
            {valorConvertido}
          </Text>
        </View>
      )}
      <StatusBar style="inverted" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    paddingTop: 40,
    alignItems: 'center'
  },
  areaMoeda: {
    backgroundColor: '#f9f9f9',
    width: '90%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 1

  },
  titulo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    paddingLeft: 8,
    paddingTop: 8
  },
  areaValor: {
    backgroundColor: '#f9f9f9',
    width: '90%',
    paddingBottom: 8
  },
  input: {
    width: '100%',
    padding: 8,
    color: '#000'
  },
  botaoArea: {
    backgroundColor: '#fb4b57',
    width: '90%',
    padding: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  botaoTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  areaResultado: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    marginTop: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  valorConvertido: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold'
  }
});
