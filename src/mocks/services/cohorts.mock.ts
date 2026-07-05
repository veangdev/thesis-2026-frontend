import { ApiError } from '@/services/api-client'
import type { CohortsService } from '@/features/cohorts/cohorts.contract'
import type {
  Cohort,
  Dimension,
  Period,
} from '@/features/cohorts/cohorts.types'
import { getDb } from '../db'
import { clone, delay, paginate } from '../latency'

export const mockCohortsService: CohortsService = {
  async list(params) {
    await delay()
    let rows = getDb().cohorts
    if (params?.status)
      rows = rows.filter((cohort) => cohort.status === params.status)
    if (params?.search) {
      const query = params.search.toLowerCase()
      rows = rows.filter((cohort) => cohort.name.toLowerCase().includes(query))
    }
    return clone(paginate(rows, { page: 1, pageSize: 50, ...params }))
  },

  async getById(id) {
    await delay(150)
    const cohort = getDb().cohorts.find((candidate) => candidate.id === id)
    if (!cohort) throw new ApiError('Cohort not found', 404)
    return clone(cohort)
  },

  async create(payload) {
    await delay()
    const db = getDb()
    const cohort: Cohort = {
      id: db.nextId(),
      name: payload.name,
      scoringScaleMax: payload.scoringScaleMax ?? 5,
      status: payload.status ?? 'active',
      startDate: payload.startDate ?? new Date().toISOString().slice(0, 10),
      endDate: payload.endDate,
      description: payload.description,
      studentCount: 0,
      createdAt: new Date().toISOString(),
    }
    db.cohorts.push(cohort)
    return clone(cohort)
  },

  async update(id, payload) {
    await delay()
    const cohort = getDb().cohorts.find((candidate) => candidate.id === id)
    if (!cohort) throw new ApiError('Cohort not found', 404)
    Object.assign(cohort, payload)
    return clone(cohort)
  },

  async listDimensions(cohortId) {
    await delay(150)
    return clone(
      getDb()
        .dimensions.filter((dimension) => dimension.cohortId === cohortId)
        .sort((a, b) => a.order - b.order)
    )
  },

  async createDimension(cohortId, payload) {
    await delay()
    const db = getDb()
    const siblings = db.dimensions.filter((d) => d.cohortId === cohortId)
    const dimension: Dimension = {
      id: db.nextId(),
      cohortId,
      name: payload.name,
      description: payload.description,
      order: payload.order ?? siblings.length + 1,
    }
    db.dimensions.push(dimension)
    return clone(dimension)
  },

  async updateDimension(id, payload) {
    await delay()
    const dimension = getDb().dimensions.find(
      (candidate) => candidate.id === id
    )
    if (!dimension) throw new ApiError('Dimension not found', 404)
    Object.assign(dimension, payload)
    return clone(dimension)
  },

  async deleteDimension(id) {
    await delay()
    const db = getDb()
    const index = db.dimensions.findIndex((candidate) => candidate.id === id)
    if (index === -1) throw new ApiError('Dimension not found', 404)
    db.dimensions.splice(index, 1)
  },

  async listPeriods(cohortId) {
    await delay(150)
    return clone(
      getDb().periods.filter((period) => period.cohortId === cohortId)
    )
  },

  async createPeriod(cohortId, payload) {
    await delay()
    const db = getDb()
    const period: Period = {
      id: db.nextId(),
      cohortId,
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: payload.status ?? 'upcoming',
    }
    db.periods.push(period)
    return clone(period)
  },

  async updatePeriod(id, payload) {
    await delay()
    const period = getDb().periods.find((candidate) => candidate.id === id)
    if (!period) throw new ApiError('Period not found', 404)
    Object.assign(period, payload)
    return clone(period)
  },

  async deletePeriod(id) {
    await delay()
    const db = getDb()
    const index = db.periods.findIndex((candidate) => candidate.id === id)
    if (index === -1) throw new ApiError('Period not found', 404)
    db.periods.splice(index, 1)
  },
}
