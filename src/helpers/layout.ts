import type { Chart, LayoutPreset, Tier } from '../types'

export const BASE_ITEM_SIZE = 260

export interface RowLayout {
  start: number
  count: number
  itemSize: number
}

export const layoutPresets: LayoutPreset[] = [
  {
    name: 'Top 10',
    tiers: [{ columns: 3, rows: 1 }, { columns: 7, rows: 1 }],
  },
  {
    name: 'Top 20',
    tiers: [{ columns: 4, rows: 1 }, { columns: 6, rows: 1 }, { columns: 10, rows: 1 }],
  },
  {
    name: 'Top 40',
    tiers: [{ columns: 4, rows: 1 }, { columns: 6, rows: 2 }, { columns: 8, rows: 3 }],
  },
  {
    name: 'Top 50',
    tiers: [{ columns: 5, rows: 1 }, { columns: 7, rows: 1 }, { columns: 9, rows: 2 }, { columns: 10, rows: 2 }],
  },
  {
    name: 'Top 100',
    tiers: [{ columns: 4, rows: 1 }, { columns: 6, rows: 1 }, { columns: 10, rows: 3 }, { columns: 12, rows: 5 }],
  },
]

export function getTiers(chart: Chart): Tier[] {
  return chart.tiers ?? [{ columns: chart.size.x, rows: chart.size.y }]
}

export function getRowLayouts(chart: Chart): RowLayout[] {
  const tiers = getTiers(chart)
  const maxColumns = Math.max(...tiers.map(tier => tier.columns))
  const rowWidth = maxColumns * BASE_ITEM_SIZE + (maxColumns - 1) * chart.gap

  const rows: RowLayout[] = []
  let start = 0

  for (const tier of tiers) {
    const itemSize = Math.floor((rowWidth - (tier.columns - 1) * chart.gap) / tier.columns)

    for (let i = 0; i < tier.rows; i++) {
      rows.push({ start, count: tier.columns, itemSize })
      start += tier.columns
    }
  }

  return rows
}

export function getTotalSlots(chart: Chart): number {
  return getTiers(chart).reduce((total, tier) => total + tier.columns * tier.rows, 0)
}
