import './table.css'
export const Table = () => {
    const function1 = (a: number, b: number) => {
        return a + b
    }

    const function2 = (a: number, b: number) => a +b
  return (
    <>
    <div>{function1(1,3)}</div>
    <div>{function2(3,1)}</div>
    </>
  )
}
