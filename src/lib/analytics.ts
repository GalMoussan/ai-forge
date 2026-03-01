import { usePlausible } from 'next-plausible'

export type AnalyticsEvent =
  | { name: 'vote'; props: { idea_id: string; category: string } }
  | { name: 'submit_idea'; props: { category: string } }
  | { name: 'pledge_start'; props: { idea_id: string; amount_cents: number } }
  | { name: 'view_idea'; props: { idea_id: string; title: string } }

type EventName = AnalyticsEvent['name']
type EventProps<T extends EventName> = Extract<AnalyticsEvent, { name: T }>['props']

export function useAnalytics() {
  const plausible = usePlausible()
  return function track<T extends EventName>(name: T, props: EventProps<T>) {
    plausible(name, { props })
  }
}
