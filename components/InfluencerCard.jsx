'use client'

export default function InfluencerCard({
  name,
  backgroundImage,
  earned,
  potential,
  saved,
  description,
  tags,
  memberType,
  followerCount,
  yearJoined
}) {
  return (
    <div className="influencer-card">
      <div className="card-header">
        <div className="influencer-name">{name}</div>
        <button className="options-btn" aria-label="More options">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M11.9991 5.92C12.2537 5.92 12.4979 5.81886 12.6779 5.63882C12.8579 5.45879 12.9591 5.21461 12.9591 4.96C12.9591 4.70539 12.8579 4.46121 12.6779 4.28118C12.4979 4.10114 12.2537 4 11.9991 4C11.7445 4 11.5003 4.10114 11.3202 4.28118C11.1402 4.46121 11.0391 4.70539 11.0391 4.96C11.0391 5.21461 11.1402 5.45879 11.3202 5.63882C11.5003 5.81886 11.7445 5.92 11.9991 5.92ZM11.9991 12.96C12.2537 12.96 12.4979 12.8589 12.6779 12.6788C12.8579 12.4988 12.9591 12.2546 12.9591 12C12.9591 11.7454 12.8579 11.5012 12.6779 11.3212C12.4979 11.1411 12.2537 11.04 11.9991 11.04C11.7445 11.04 11.5003 11.1411 11.3202 11.3212C11.1402 11.5012 11.0391 11.7454 11.0391 12C11.0391 12.2546 11.1402 12.4988 11.3202 12.6788C11.5003 12.8589 11.7445 12.96 11.9991 12.96ZM11.9991 20C12.2537 20 12.4979 19.8989 12.6779 19.7188C12.8579 19.5388 12.9591 19.2946 12.9591 19.04C12.9591 18.7854 12.8579 18.5412 12.6779 18.3612C12.4979 18.1811 12.2537 18.08 11.9991 18.08C11.7445 18.08 11.5003 18.1811 11.3202 18.3612C11.1402 18.5412 11.0391 18.7854 11.0391 19.04C11.0391 19.2946 11.1402 19.5388 11.3202 19.7188C11.5003 19.8989 11.7445 20 11.9991 20Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="card-details">
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-value">{earned}</div>
            <div className="stat-label">Earned</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{potential}</div>
            <div className="stat-label">Potential</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{saved}</div>
            <div className="stat-label">Saved</div>
          </div>
        </div>

        <div className="tags-section">
          <div className="member-tag">{memberType}</div>
          <div className="info-tag">QLIQR Since {yearJoined}</div>
          <div className="info-tag">{followerCount} Followers</div>
        </div>

        <p className="description">{description}</p>
      </div>

      <div className="card-actions">
        <button className="view-profile-btn">View Profile</button>
      </div>

      <style jsx>{`
        .influencer-card {
          display: flex;
          width: 348px;
          padding: 24px;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 140px;
          border-radius: 16px;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), 
                      url('${backgroundImage}') lightgray 50% / cover no-repeat;
          position: relative;
          height: 464px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          position: absolute;
          left: 24px;
          top: 24px;
          width: 300px;
          height: 24px;
        }

        .influencer-name {
          flex: 1 0 0;
          color: #FFF;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 150%;
        }

        .options-btn {
          width: 24px;
          height: 24px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .card-details {
          display: flex;
          width: 300px;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          position: absolute;
          left: 24px;
          top: 188px;
          height: 252px;
        }

        .stats-section {
          display: flex;
          width: 300px;
          justify-content: space-between;
          align-items: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .stat-value {
          align-self: stretch;
          color: #FFF;
          text-align: center;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 24px;
          font-weight: 700;
          line-height: 140%;
        }

        .stat-label {
          align-self: stretch;
          color: #FFF;
          text-align: center;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 700;
          line-height: 150%;
        }

        .tags-section {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
          flex-wrap: wrap;
        }

        .member-tag {
          display: flex;
          padding: 8px 16px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          border-radius: 8px;
          background: linear-gradient(90deg, #CE8946 0%, #794108 100%);
          color: #FFF;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 150%;
        }

        .info-tag {
          display: flex;
          padding: 8px 16px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          border-radius: 8px;
          border: 1px solid #FFF;
          color: #FFF;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 150%;
        }

        .description {
          align-self: stretch;
          color: #FFF;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 700;
          line-height: 150%;
          margin: 0;
        }

        .card-actions {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
          position: absolute;
          bottom: 24px;
          left: 24px;
          right: 24px;
        }

        .view-profile-btn {
          display: flex;
          padding: 8px 16px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex: 1 0 0;
          border-radius: 100px;
          border: 1px solid #FFF;
          background: none;
          color: #FFF;
          text-align: center;
          font-family: 'DM Sans', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 150%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-profile-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .influencer-card {
            width: 300px;
          }

          .card-header {
            width: 252px;
          }

          .card-details {
            width: 252px;
          }

          .stats-section {
            width: 252px;
          }
        }
      `}</style>
    </div>
  )
}
