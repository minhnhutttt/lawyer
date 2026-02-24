type ContainerProps = {
  sidebar?: React.ReactNode
  children: React.ReactNode
}

export default function Container({ sidebar, children }: ContainerProps) {
  return (
    <div className="w-full max-w-[980px] mx-auto flex px-2.5 gap-5 mt-[5px] max-md:flex-col">
      <div className="w-full md:max-w-[640px]">
        {children}
      </div>
      {sidebar && (
        <aside className="md:w-[300px]">
          {sidebar}
        </aside>
      )}
    </div>
  )
}
