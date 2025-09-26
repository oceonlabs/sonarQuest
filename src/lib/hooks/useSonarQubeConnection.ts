import { useState, useEffect } from 'react'
import { configService } from '../configService'
import type { SonarQubeConnectionConfig } from '../configService'

export function useSonarQubeConnection() {
  const [config, setConfig] = useState<SonarQubeConnectionConfig>(configService.getConfig())

  useEffect(() => {
    const unsubscribe = configService.subscribe(setConfig)
    return unsubscribe
  }, [])

  return config
}