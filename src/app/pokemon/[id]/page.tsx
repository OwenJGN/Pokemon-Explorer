interface PageProps {
  params: {
    id: string
  }
}

export default function DisplayDetails({params}: PageProps){
    const pokeId = params.id

    return ( <><h1>These are the details for {pokeId}</h1></>);
}