import  'react';
import styled from 'styled-components';

const Button = () => {
    return (
      <StyledWrapper>
        <button className="button">
          <div className="outline" />
          <div className="state state--default">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                height="1.2em"
                width="1.2em"
              >
                <g style={{ filter: "url(#shadow)" }}>
                  <path
                    fill="currentColor"
                    d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63Z"
                  />
                  <path
                    fill="currentColor"
                    d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z"
                  />
                </g>
                <defs>
                  <filter id="shadow">
                    <feDropShadow
                      floodOpacity="0.6"
                      stdDeviation="0.8"
                      dy={1}
                      dx={0}
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <p>
              {[..."Send Message"].map((char, index) => (
                <span key={index} style={{ "--i": index }}>{char}</span>
              ))}
            </p>
          </div>
          <div className="state state--sent">
            <div className="icon">
              <svg
                stroke="black"
                strokeWidth="0.5px"
                width="1.2em"
                height="1.2em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g style={{ filter: "url(#shadow)" }}>
                  <path
                    d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </div>
            <p>
              {[..."Sent!"].map((char, index) => (
                <span key={index} style={{ "--i": index + 5 }}>{char}</span>
              ))}
            </p>
          </div>
        </button>
      </StyledWrapper>
    );
  };
const StyledWrapper = styled.div`
  .button {
    --primary: #4f46e5;
    --neutral-1: #ffffff;
    --neutral-2: #f3f4f6;
    --radius: 16px;

    cursor: pointer;
    border-radius: var(--radius);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    border: none;
    box-shadow:
      0 1px 1px rgba(255, 255, 255, 0.4),
      0 12px 24px rgba(0, 0, 0, 0.15),
      0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    min-width: 220px;
    padding: 22px;
    height: 72px;
    font-family: "Inter", system-ui, sans-serif;
    font-style: normal;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.2px;
  }

  .button:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      0 2px 2px rgba(255, 255, 255, 0.4),
      0 18px 32px rgba(0, 0, 0, 0.15),
      0 8px 12px rgba(0, 0, 0, 0.1);
  }

  .button:active {
    transform: scale(1);
    box-shadow:
      0 0 1px 2px rgba(255, 255, 255, 0.3),
      0 10px 3px -3px rgba(0, 0, 0, 0.2);
  }
  .button:after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: var(--radius);
    border: 2.5px solid transparent;
    background:
      linear-gradient(var(--neutral-1), var(--neutral-2)) padding-box,
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.45))
        border-box;
    z-index: 0;
    transition: all 0.4s ease;
  }
  .button:hover::after {
    transform: scale(1.05, 1.1);
    box-shadow: inset 0 -1px 3px 0 rgba(255, 255, 255, 1);
  }
  .button::before {
    content: "";
    inset: 7px 6px 6px 6px;
    position: absolute;
    background: linear-gradient(to top, var(--neutral-1), var(--neutral-2));
    border-radius: 30px;
    filter: blur(0.5px);
    z-index: 2;
  }
  .state p {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .state .icon {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    transform: scale(1.25);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .state .icon svg {
    overflow: visible;
  }

  /* Outline */
  .outline {
    position: absolute;
    border-radius: inherit;
    overflow: hidden;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.4s ease;
    inset: -2px -3.5px;
  }
  .outline::before {
    content: "";
    position: absolute;
    inset: -100%;
    background: conic-gradient(
      from 180deg,
      transparent 60%,
      var(--primary) 85%,
      transparent 100%
    );
    animation: spin 2.5s linear infinite;
    animation-play-state: paused;
    opacity: 0.7;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .button:hover .outline {
    opacity: 1;
  }
  .button:hover .outline::before {
    animation-play-state: running;
  }

  /* Letters */
  .state p span {
    display: block;
    opacity: 0;
    animation: slideDown 0.8s ease forwards calc(var(--i) * 0.03s);
  }
  .button:hover p span {
    opacity: 1;
    animation: wave 0.5s ease forwards calc(var(--i) * 0.02s);
  }
  .button:focus p span {
    opacity: 1;
    animation: disapear 0.6s ease forwards calc(var(--i) * 0.03s);
  }
  @keyframes wave {
    30% {
      opacity: 1;
      transform: translateY(4px) translateX(0) rotate(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-4px) translateX(0) rotate(0);
      color: var(--primary);
    }
    100% {
      opacity: 1;
      transform: translateY(0) translateX(0) rotate(0);
    }
  }
  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-20px) translateX(5px) rotate(-90deg);
      color: var(--primary);
      filter: blur(5px);
    }
    30% {
      opacity: 1;
      transform: translateY(4px) translateX(0) rotate(0);
      filter: blur(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-3px) translateX(0) rotate(0);
    }
    100% {
      opacity: 1;
      transform: translateY(0) translateX(0) rotate(0);
    }
  }
  @keyframes disapear {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: translateX(5px) translateY(20px);
      color: var(--primary);
      filter: blur(5px);
    }
  }

  /* Plane */
  .state--default .icon svg {
    animation: land 0.6s ease forwards;
  }
  .button:hover .state--default .icon {
    transform: rotate(45deg) scale(1.25);
  }
  .button:focus .state--default svg {
    animation: takeOff 0.8s linear forwards;
  }
  .button:focus .state--default .icon {
    transform: rotate(0) scale(1.25);
  }
  @keyframes takeOff {
    0% {
      opacity: 1;
    }
    60% {
      opacity: 1;
      transform: translateX(80px) rotate(45deg) scale(2.2);
    }
    100% {
      opacity: 0;
      transform: translateX(180px) rotate(45deg) scale(0);
    }
  }
  @keyframes land {
    0% {
      transform: translateX(-60px) translateY(30px) rotate(-50deg) scale(2);
      opacity: 0;
      filter: blur(3px);
    }
    100% {
      transform: translateX(0) translateY(0) rotate(0);
      opacity: 1;
      filter: blur(0);
    }
  }

  /* Contrail */
  .state--default .icon:before {
    content: "";
    position: absolute;
    top: 50%;
    height: 2px;
    width: 0;
    left: -5px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5));
  }
  .button:focus .state--default .icon:before {
    animation: contrail 0.8s linear forwards;
  }
  @keyframes contrail {
    0% {
      width: 0;
      opacity: 1;
    }
    8% {
      width: 15px;
    }
    60% {
      opacity: 0.7;
      width: 80px;
    }
    100% {
      opacity: 0;
      width: 160px;
    }
  }

  /* States */
  .state {
    padding-left: 29px;
    z-index: 2;
    display: flex;
    position: relative;
  }
  .state--default span:nth-child(4) {
    margin-right: 5px;
  }
  .state--sent {
    display: none;
  }
  .state--sent svg {
    transform: scale(1.25);
    margin-right: 8px;
  }
  .button:focus .state--default {
    position: absolute;
  }
  .button:focus .state--sent {
    display: flex;
  }
  .button:focus .state--sent span {
    opacity: 0;
    animation: slideDown 0.8s ease forwards calc(var(--i) * 0.2s);
  }
  .button:focus .state--sent .icon svg {
    opacity: 0;
    animation: appear 1.2s ease forwards 0.8s;
  }
  @keyframes appear {
    0% {
      opacity: 0;
      transform: scale(4) rotate(-40deg);
      color: var(--primary);
      filter: blur(4px);
    }
    30% {
      opacity: 1;
      transform: scale(0.6);
      filter: blur(1px);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
      filter: blur(0);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }`;

export default Button;
