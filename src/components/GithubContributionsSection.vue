<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { GITHUB } from '../data/config'

const username = 'faisalandriansah'
const year = new Date().getFullYear()
const contributions = ref([])
const total = ref(0)
const loading = ref(true)
const error = ref('')
let refreshTimer

const activeDays = computed(() => contributions.value.filter((day) => day.count > 0).length)

const weeks = computed(() => {
  const byDate = new Map(contributions.value.map((day) => [day.date, day]))
  const start = new Date(year, 0, 1)
  start.setDate(start.getDate() - start.getDay())
  const end = new Date(year, 11, 31)
  end.setDate(end.getDate() + (6 - end.getDay()))
  const result = []

  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 7)) {
    const week = []
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(cursor)
      date.setDate(cursor.getDate() + day)
      const dateKey = date.toISOString().slice(0, 10)
      week.push(byDate.get(dateKey) || { date: dateKey, count: 0, level: 0 })
    }
    result.push(week)
  }
  return result
})

const months = computed(() =>
  Array.from({ length: 12 }, (_, month) => ({
    label: new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(year, month, 1)),
    month,
  }))
)

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

async function loadContributions() {
  loading.value = contributions.value.length === 0
  error.value = ''

  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`
    )
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    const data = await response.json()
    if (!Array.isArray(data.contributions)) throw new Error('Invalid contribution data')

    contributions.value = data.contributions
    total.value = data.total?.[year] || data.contributions.reduce((sum, day) => sum + day.count, 0)
  } catch (requestError) {
    error.value = 'Kontribusi GitHub belum dapat dimuat. Coba lagi nanti.'
    console.error('Failed to load GitHub contributions:', requestError)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadContributions()
  refreshTimer = window.setInterval(loadContributions, 30 * 60 * 1000)
})

onBeforeUnmount(() => window.clearInterval(refreshTimer))
</script>

<template>
  <section id="github" class="github-contributions">
    <div class="github-heading">
      <div>
        <p class="eyebrow"><b>05</b>GitHub activity</p>
        <h2 class="github-title">Contribution<br><em>archive.</em></h2>
      </div>
      <div class="github-heading-meta">
        <a class="github-profile" :href="GITHUB" target="_blank" rel="noopener">@{{ username }} ↗</a>
      </div>
    </div>

    <div class="github-card">
      <p v-if="loading" class="github-state">Memuat kontribusi GitHub...</p>
      <p v-else-if="error" class="github-state github-error" role="alert">{{ error }}</p>
      <template v-else>
        <div class="github-card-top">
          <div>
            <p class="github-kicker">{{ year }} / Activity</p>
            <h3>{{ total }} <span>contributions</span></h3>
          </div>
          <div class="github-stats">
            <div><strong>{{ activeDays }}</strong><span>days active</span></div>
          </div>
        </div>
        <div class="github-graph-wrap">
          <div class="github-months" aria-hidden="true">
            <span v-for="month in months" :key="month.month">{{ month.label }}</span>
          </div>
          <div class="github-graph-row">
            <div class="github-days" aria-hidden="true">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div class="github-grid" :aria-label="`${total} GitHub contributions in ${year}`">
              <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="github-week">
                <span
                  v-for="day in week"
                  :key="day.date"
                  class="github-cell"
                  :class="`level-${day.level}`"
                  :title="`${day.count} contributions on ${formatDate(day.date)}`"
                ></span>
              </div>
            </div>
          </div>
          <div class="github-legend">
            <span>Less</span>
            <i class="github-cell level-0"></i>
            <i class="github-cell level-1"></i>
            <i class="github-cell level-2"></i>
            <i class="github-cell level-3"></i>
            <i class="github-cell level-4"></i>
            <span>More</span>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.github-contributions {
  width: 100%;
  max-width: 100%;
  padding: clamp(6rem, 12vw, 12rem) 0;
  overflow: hidden;
}

.github-heading {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  align-items: flex-end;
  min-width: 0;
  margin-bottom: 3.5rem;
}

.github-title {
  max-width: 7ch;
  margin: 0;
  font-size: clamp(3rem, 8vw, 8rem);
  line-height: 0.82;
  letter-spacing: -0.07em;
  font-weight: 800;
}

.github-title em {
  color: var(--accent);
  font-style: normal;
}

.github-heading-meta {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0.65rem;
  color: var(--muted);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.github-heading-meta .github-profile {
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid var(--line);
  color: var(--fg);
  letter-spacing: 0;
  text-transform: none;
}

.github-profile {
  display: inline-flex;
  align-items: center;
  color: var(--fg);
  font-size: 0.8rem;
  text-decoration: none;
  white-space: nowrap;
}

.github-profile:hover {
  color: var(--fg);
}

.github-status {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: var(--accent);
}

.github-card {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border-top: 2px solid var(--fg);
  border-bottom: 1px solid var(--line);
  padding: 1.5rem 0 1.25rem;
  overflow: hidden;
}

.github-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  min-width: 0;
  margin-bottom: 1.5rem;
}

.github-kicker {
  margin: 0 0 0.5rem;
  color: var(--muted);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.github-card h3 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.5rem);
  letter-spacing: -0.05em;
  line-height: 1;
}

.github-card h3 span {
  color: var(--muted);
  font-size: 0.45em;
  font-weight: 400;
}

.github-stats {
  display: flex;
  gap: 2rem;
}

.github-stats div {
  display: grid;
  gap: 0.25rem;
  text-align: right;
}

.github-stats strong {
  font-size: 1.5rem;
  font-weight: 500;
}

.github-stats span {
  color: var(--muted);
  font-size: 0.65rem;
  text-transform: uppercase;
}

.github-state {
  color: var(--muted);
  margin: 0;
}

.github-error {
  color: var(--accent);
}

.github-graph-wrap {
  width: 100%;
  min-width: 0;
  padding-top: 0.75rem;
}

.github-months {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  padding-left: 2.5rem;
  padding-right: 0.1rem;
  gap: 0.1rem;
  color: var(--muted);
  font-size: clamp(0.52rem, 1.2vw, 0.75rem);
}

.github-months span {
  text-align: left;
}

.github-graph-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.35rem;
  min-width: 0;
}

.github-days {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  flex: 0 0 2rem;
  color: var(--muted);
  font-size: 0.7rem;
}

.github-days span {
  align-self: center;
}

.github-days span:nth-child(1) {
  grid-row: 2;
}

.github-days span:nth-child(2) {
  grid-row: 4;
}

.github-days span:nth-child(3) {
  grid-row: 6;
}

.github-grid {
  display: flex;
  flex: 1;
  min-width: 0;
  justify-content: space-between;
  gap: clamp(0.08rem, 0.35vw, 0.2rem);
}

.github-week {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  min-width: 0;
  gap: clamp(0.08rem, 0.35vw, 0.2rem);
}

.github-cell {
  display: block;
  width: clamp(0.28rem, 1.2vw, 0.85rem);
  min-width: 0;
  aspect-ratio: 1;
  border-radius: 0.1rem;
  background: color-mix(in srgb, var(--fg) 11%, transparent);
  transition: outline 0.15s ease, background 0.15s ease;
}

.github-cell.level-1 {
  background: color-mix(in srgb, var(--accent) 32%, transparent);
}

.github-cell.level-2 {
  background: color-mix(in srgb, var(--accent) 48%, transparent);
}

.github-cell.level-3 {
  background: color-mix(in srgb, var(--accent) 70%, transparent);
}

.github-cell.level-4 {
  background: var(--accent);
}

.github-cell:hover {
  outline: 1px solid var(--fg);
  outline-offset: 1px;
}

.github-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
  margin-top: 1rem;
  color: var(--muted);
  font-size: 0.7rem;
}

.github-legend .github-cell {
  width: 0.75rem;
}

@media (max-width: 700px) {
  .github-heading {
    display: block;
  }

  .github-heading-meta {
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .github-heading-meta .github-profile {
    margin-left: 0.35rem;
  }

  .github-card-top {
    display: block;
  }

  .github-stats {
    justify-content: flex-start;
    margin-top: 1.5rem;
  }

  .github-stats div {
    text-align: left;
  }

  .github-card {
    padding-top: 1.25rem;
  }

  .github-graph-row {
    gap: 0.3rem;
  }

  .github-days {
    flex-basis: 1.5rem;
    font-size: 0.55rem;
  }

  .github-months {
    padding-left: 1.8rem;
  }
}

@media (max-width: 420px) {
  .github-contributions {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .github-heading-meta {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    line-height: 1.4;
  }

  .github-heading-meta .github-profile {
    grid-column: 1 / -1;
    margin: 0.25rem 0 0;
    padding: 0;
    border: 0;
  }

  .github-card {
    padding-right: 0.75rem;
    padding-left: 0.75rem;
  }

  .github-stats {
    gap: 1.25rem;
  }

  .github-legend {
    font-size: 0.6rem;
  }
}
</style>
