import { Picker } from '@react-native-picker/picker'
import React from 'react'



export default function PickerItem(props) {

    let moedas = props.moedas.map((moeda) => {
        return (
            <Picker.Item label={moeda.label} value={moeda.value} key={moeda.key} />
        )
    })

    return (
        <Picker selectedValue={props.moedaSelecionada} onValueChange={props.onChange}>
            {moedas}
        </Picker>
    )
}
