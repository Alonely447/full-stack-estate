import './list.scss'
import Card from"../card/Card"

function List({posts, currentUser}){
  return (
    <div className='list'>
      {posts.map(item=>(
        <Card key={item.id} item={item} currentUser={currentUser} />
      ))}
    </div>
  )
}

export default List