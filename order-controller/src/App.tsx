import { useState, useRef, useEffect } from 'react'
import { RoleType, OrderStatus, type OrderItemType } from './App.d'
import './App.css'

function App() {
  const [pendingList, setPendingList] = useState<OrderItemType[]>([])
  const [completeList, setCompleteList] = useState<OrderItemType[]>([])
  const [bots, setBots] = useState<number[]>([])
  const [currentOrders, setCurrentOrders] = useState<Record<number, OrderItemType | null>>({})

  const botCounter = useRef(0)
  const botTasks = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  // Process orders when bots or lists change
  useEffect(() => {
    bots.forEach(botId => {
      const isIdle = !currentOrders[botId]
      const nextOrderIndex = pendingList.findIndex(order => order.status === OrderStatus.PENDING)
      if (isIdle && nextOrderIndex !== -1) {
        const nextOrder = pendingList[nextOrderIndex]
        // Mark as processing
        setPendingList(prev => {
          const updated = [...prev]
          updated[nextOrderIndex] = { ...updated[nextOrderIndex], status: OrderStatus.IN_PROGRESS }
          return updated
        })
        setCurrentOrders(prev => ({ ...prev, [botId]: nextOrder }))

        const timeoutId = setTimeout(() => {
          setPendingList(prev => prev.filter(order => order.id !== nextOrder.id))
          setCompleteList(prev => [...prev, nextOrder])
          setCurrentOrders(prev => ({ ...prev, [botId]: null }))
        }, 10000)

        botTasks.current[botId] = timeoutId
      }
    })
  }, [bots, pendingList, currentOrders])


  const addOrder = (role: RoleType) => {
    const newOrder: OrderItemType = {
      id: Date.now(),
      name: `Order-${pendingList.length + completeList.length + 1}`,
      role,
      status: OrderStatus.PENDING
    }
    addPendingList(newOrder)
  }

  const addBot = () => {
    const botId = ++botCounter.current
    setBots(prev => [...prev, botId])
    setCurrentOrders(prev => ({ ...prev, [botId]: null }))
  }

  const removeBot = () => {
    const lastBotId = bots[bots.length - 1]
    if (lastBotId === undefined) return
  
    clearTimeout(botTasks.current[lastBotId])
    delete botTasks.current[lastBotId]
  
    const currentOrder = currentOrders[lastBotId]
    if (currentOrder) {
      // Reset its status in pendingList back to 'pending'
      setPendingList(prev =>
        prev.map(order =>
          order.id === currentOrder.id
            ? { ...order, status: OrderStatus.PENDING }
            : order
        )
      )
    }
  
    setCurrentOrders(prev => {
      const updated = { ...prev }
      delete updated[lastBotId]
      return updated
    })
  
    setBots(prev => prev.slice(0, -1))
  }

  const addPendingList = (newOrder: OrderItemType) => {
    setPendingList(prev => {
      if (newOrder.role === RoleType.NORMAL) {
        return [...prev, newOrder]
      } else {
        // Insert after last VIP order
        const lastVIPIndex = [...prev].reverse().findIndex(order => order.role === RoleType.VIP)
        if (lastVIPIndex === -1) {
          return [newOrder, ...prev]
        } else {
          const insertIndex = prev.length - lastVIPIndex
          return [...prev.slice(0, insertIndex), newOrder, ...prev.slice(insertIndex)]
        }
      }
    })
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-10">Order Controller</h1>

      <div className="mb-6">
        <button className="bg-green-500 text-white px-4 py-2 mr-2 cursor-pointer" onClick={() => addOrder(RoleType.NORMAL)}>🧍 Normal Order</button>
        <button className="bg-yellow-500 text-white px-4 py-2 mr-2 cursor-pointer" onClick={() => addOrder(RoleType.VIP)}>👑 VIP Order</button>
        <button className="bg-blue-500 text-white px-4 py-2 mr-2 cursor-pointer" onClick={addBot}>➕ Add Bot</button>
        <button className="bg-red-500 text-white px-4 py-2 cursor-pointer" onClick={removeBot} disabled={bots.length === 0}>➖ Remove Bot</button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <h2 className="font-bold mb-2">PENDING</h2>
          <ul className="divide-y divide-white-100 border rounded">
            {pendingList.map(order => (
              <li className="p-4" key={`PENDING-${order.id}`}>
                {order.name} ({order.role === RoleType.VIP ? '👑 VIP' : '🧍 Normal'}) - {order.status}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          <h2 className="font-bold mb-2">COMPLETED</h2>
          <ul className="divide-y divide-white-100 border rounded">
            {completeList.map(order => (
              <li className="p-4" key={`COMPLETED-${order.id}`}>
                {order.name} ({order.role === RoleType.VIP ? '👑 VIP' : '🧍 Normal'})
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          <h2 className="font-bold mb-2">BOTS</h2>
          <ul className="divide-y divide-white-100 border rounded">
            {bots.map(botId => (
              <li className="p-4" key={botId}>
                Bot #{botId}: {currentOrders[botId]?.name ?? 'Idle'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
