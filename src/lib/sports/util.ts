import { NATIONAL_NETWORKS } from '../../data/sports-config';

export function isNationalBroadcast(name?: string): boolean {
	if (!name) return false;
	const lower = name.toLowerCase();
	return NATIONAL_NETWORKS.some((n) => lower.includes(n.toLowerCase()));
}

export function toDateStr(d: Date): string {
	return d.toISOString().slice(0, 10);
}

// ESPN's "score" field shows up as a plain number in some responses and as
// { value, displayValue } in others (e.g. team schedule endpoints). Coercing
// the object form with Number() silently produces NaN, which then serializes
// to JSON as null — that's the "null - null" bug. Extract it defensively.
export function extractScore(raw: unknown): number | undefined {
	if (raw === undefined || raw === null) return undefined;
	if (typeof raw === 'number') return Number.isNaN(raw) ? undefined : raw;
	if (typeof raw === 'string') {
		const n = Number(raw);
		return Number.isNaN(n) ? undefined : n;
	}
	if (typeof raw === 'object') {
		const obj = raw as { value?: unknown; displayValue?: unknown };
		if (typeof obj.value === 'number' && !Number.isNaN(obj.value)) return obj.value;
		if (typeof obj.displayValue === 'string') {
			const n = Number(obj.displayValue);
			return Number.isNaN(n) ? undefined : n;
		}
	}
	return undefined;
}

// Small helper so one slow/broken upstream API can't hang the whole page.
export async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
	let timer: ReturnType<typeof setTimeout>;
	const timeout = new Promise<T>((resolve) => {
		timer = setTimeout(() => resolve(fallback), ms);
	});
	try {
		return await Promise.race([promise, timeout]);
	} finally {
		clearTimeout(timer!);
	}
}
