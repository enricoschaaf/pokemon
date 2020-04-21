import { useEffect, useState } from "react"
import { useQuery } from "react-query"

async function getPokemonByName(_key: string, name: string) {
  const query = `query ($name: String) {
                    pokemon(name: $name) {
                        name
                        image
    
                   }
                }`
  const variables = {
    name
  }

  const response = await fetch("https://graphql-pokemon.now.sh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
  const data = await response.json()

  if (data.errors) {
    throw new Error(data.errors[0].message)
  }

  return data.data
}

export function Search() {
  const [name, setName] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [event, setEvent] = useState(null)
  const {
    status,
    data,
    error
  }: {
    status: "error" | "loading" | "success"
    data: any
    error: any
  } = useQuery(
    //@ts-ignore
    name && ["getPokemonByName", name],
    getPokemonByName,
    { onSuccess: () => (event.target[0].value = "") }
  )

  useEffect(() => {
    if (data?.pokemon?.image) {
      const image = new Image()
      image.src = data.pokemon.image
      image.onload = () => {
        setIsLoaded(true)
      }
    }
  }, [data])

  return (
    <div className="flex justify-center max-w-7xl mx-auto sm:p-6 lg:px-8 sm:h-screen sm:items-center">
      <div className="grid gap-4 w-full sm:w-auto">
        <div className="bg-white overflow-hidden sm:shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form
              onSubmit={(e) => {
                setIsLoaded(false)
                setEvent(e)
                e.preventDefault()
                setName(e.target[0].value)
                e.target[0].value = ""
                e.persist()
              }}
            >
              <div>
                <label htmlFor="pokemon" className="sr-only">
                  Pokemon
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="pokemon"
                    className="form-input block w-full sm:text-sm sm:leading-5 placeholder-gray-400"
                    placeholder="Pokemon"
                    required
                    //@ts-ignore
                    enterkeyhint="Search"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-white overflow-hidden sm:shadow sm:rounded-lg w-full sm:w-96">
          <div className="w-full justify-center">
            {status === "loading" || (data?.pokemon && !isLoaded) ? (
              <div className="grid grid-rows-1 h-96">
                <div className="px-4 py-5 sm:px-6">
                  <div className="rounded-lg shimmer h-full"></div>
                </div>
                <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
                  <h2 className="text-transparent inline text-lg rounded-lg shimmer">
                    {name}
                  </h2>
                </div>
              </div>
            ) : status === "success" && data?.pokemon && isLoaded ? (
              <div className="grid grid-rows-1 row-gap-4 h-96">
                <img
                  src={data.pokemon?.image}
                  alt={data.pokemon?.name}
                  className="object-contain h-full px-4 py-5 sm:px-6"
                  style={{ justifySelf: "center" }}
                />
                <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
                  <h2 className="text-gray-400 inline text-lg">
                    {data.pokemon?.name}
                  </h2>
                </div>
              </div>
            ) : status === "success" && data?.pokemon === null ? (
              <div className="flex justify-center items-center h-96">
                <span className="text-gray-400 px-4 py-3 sm:px-6 break-normal text-center">
                  {name} is not part of the Pokedex.
                </span>
              </div>
            ) : status === "error" ? (
              <div className="flex justify-center items-center h-96">
                <span className="text-gray-400 px-4 py-3 sm:px-6 break-normal text-center">
                  {error.message}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
