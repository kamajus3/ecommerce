import { useCampaign } from '@/hooks/useCampaign'
import { Link } from '@/navigation'

export default function FixedCampaign() {
  const { campaignData } = useCampaign()
  let campaign

  if (campaignData) {
    campaign = campaignData.find((c) => c.fixed === true)
  }

  return (
    <div>
      {campaign && (
        <Link
          href={`/campaign/${campaign.id}`}
          className="inline-block w-full bg-secondary p-[6px]"
        >
          <p className="text-center text-sm font-bold">{campaign.title}</p>
        </Link>
      )}
    </div>
  )
}
