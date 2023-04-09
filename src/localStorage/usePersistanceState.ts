import { useEffect, useState } from 'react';

export type Value =
  | {}
  | ReadonlyArray<unknown>
  | string
  | number
  | boolean
  | null
export type SetValue<V extends Value> = (arg0: ((arg0: V) => V) | V) => void
export type StateType<V extends Value> = {
  version: number
  value: V
}

const isStateValid = (state: any) => {
  const stateKeys = Object.keys(state ?? {})
    .sort()
    .toString()
  const validKeys = ["version", "value"].sort().toString()
  return stateKeys === validKeys
}

const usePersistentState = <V extends Value>(
  key: string,
  defaultState: StateType<V>,
  upgradeState?: (arg0: StateType<V>) => V
): [V, SetValue<V>] => {
  // Initialize value to preexisting localstorage value or use the default value
  const [value, setValue] = useState<V>((): V => {
    const stored = localStorage.getItem(key)
    // @ts-expect-error - null works but TS does not accept it
    const storedObject = JSON.parse(stored)
    const storedState = isStateValid(storedObject)
      ? {
        version: storedObject.version,
        value: storedObject.value,
      }
      : {
        version: 1,
        value: storedObject,
      }

    try {
      // If an upgrade callback was provided, then use that to initialize the value.
      if (upgradeState) {
        return upgradeState(storedState)
      }

      // If an existing stored state was found and the stored version matches the new version,
      // then use the stored value.
      if (stored !== null && storedState.version === defaultState.version) {
        return storedState.value
      }
      return defaultState.value
    } catch (e) {
      // In the case of an error in the `upgradeState` callback, use the default value.
      console.warn(
        `'usePersistentState' upgrade error for '${key}'; Using default value instead.`
      )
      return defaultState.value
    }
  })

  // Keep localstorage up to date when value changes
  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify({
        version: defaultState.version,
        value,
      })
    )
  }, [key, value, defaultState.version])

  // Sync changes to localstorage from other tabs
  useEffect(() => {
    const syncState = () => {
      const stored = localStorage.getItem(key)
      // @ts-expect-error - JSON.parse requires a string in TS
      const storedValue = JSON.parse(stored)?.value
      if (
        stored !== null &&
        storedValue !== undefined &&
        JSON.stringify(storedValue) !== JSON.stringify(value)
      )
        setValue(storedValue)
    }

    document.addEventListener("storage", syncState)
    return () => document.removeEventListener("storage", syncState)
  }, [key, value])
  // Return state handles
  return [value, setValue]
}

export default usePersistentState