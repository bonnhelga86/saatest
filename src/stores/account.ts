import { reactive } from 'vue'
import { defineStore } from 'pinia'

export type Person = {
  tags: string,
  type: string,
  login: string,
  password?: string
}

type SavedPerson = Person & {tags: {text: string}[]}

export const useAccountStore = defineStore('account', () => {
  const defaultData = JSON.parse(localStorage.getItem('store') || '[]');

  const prepareToForm = () => (defaultData.map((item: SavedPerson) => ({
    ...item,
    tags: item.tags.map(({ text }: {text: string}) => text).join(';')
  })));
  
  const formModel = reactive<Person[]>(prepareToForm());
  
  const prepareToSend = () => (formModel.map((item: Person) => ({
    ...item,
    ...(item.type==='ldap' && { password: null }),
    tags: item.tags.split(';').filter(Boolean).map((text)=>({ text })),
  })));

  const update = () => {
    const prepared = prepareToSend();
    localStorage.setItem('store', JSON.stringify(prepared));
    return prepared;
  }

  const add = (account: Person) => {
    formModel.push({
      tags: '', type: 'local', login: '', password: ''
    })
  }

  const remove = (index: number) => {
    formModel.splice(index, 1);
    update();
  }

  return { formModel, add, remove, update }
})
