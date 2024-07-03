import Link from 'next/link'

import { useCampaign } from '@/hooks/useCampaign'
import { useInformation } from '@/hooks/useInformation'

export default function FixedCampaign() {
  const { informationsData } = useInformation()
  const { campaignData } = useCampaign()

  return (
    <div>
      {informationsData.fixedCampaign && (
        <Link
          href={`/campanha/${informationsData.fixedCampaign}`}
          className="inline-block w-full bg-secondary p-[6px]"
        >
          <p className="text-center text-sm font-bold">
            {campaignData[informationsData.fixedCampaign].title}
          </p>
        </Link>
      )}
    </div>
  )
}