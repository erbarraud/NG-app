import { DashboardShell } from "@/components/dashboard-shell"
import { LinePage } from "@/components/line-page"
import { BoardScanning } from "@/components/board-scanning"
import { ZoomProvider } from "@/contexts/zoom-context"

interface BoardFinderPageProps {
  searchParams: {
    boardId?: string
  }
}

export default function BoardFinderPage({ searchParams }: BoardFinderPageProps) {
  const { boardId } = searchParams

  return (
    <DashboardShell>
      <div className="container mx-auto px-6 pt-2 pb-6">
        <div className="mb-6"></div>

        {boardId ? (
          <ZoomProvider>
            <BoardScanning boardId={boardId} />
          </ZoomProvider>
        ) : (
          <LinePage />
        )}
      </div>
    </DashboardShell>
  )
}
