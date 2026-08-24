'use server'

export async function createPost(formData: FormData) {
  const name = formData.get('name')
  const age = formData.get('age')
  console.log(name, age)
}