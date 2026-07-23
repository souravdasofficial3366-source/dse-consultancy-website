"use client";

import { useMemo, useState } from "react";
import {
  formatInr,
  pricingServices,
  type PricingPackage
} from "@/data/service-pricing";

function getDiscountRate(serviceCount: number) {
  if (serviceCount >= 4) return 20;
  if (serviceCount === 3) return 15;
  if (serviceCount === 2) return 10;
  return 0;
}

export function CustomBundlePlanner({ whatsapp }: { whatsapp: string }) {
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string | null>>({});

  const estimate = useMemo(() => {
    const selected = pricingServices.filter((service) => selectedServices[service.id]);
    const items = selected.flatMap((service) => {
      const selectedId = selectedPlans[service.id];
      const plan = service.packages.find((candidate) => candidate.id === selectedId);
      return plan ? [{ service, plan }] : [];
    });
    const isComplete =
      selected.length > 0 &&
      selected.every((service) => Boolean(selectedPlans[service.id]));
    const oneTime = items
      .filter((item) => item.service.billing === "one-time")
      .reduce((total, item) => total + item.plan.price, 0);
    const monthly = items
      .filter((item) => item.service.billing === "monthly")
      .reduce((total, item) => total + item.plan.price, 0);
    const subtotal = oneTime + monthly;
    const discountRate = getDiscountRate(items.length);
    const discount = Math.round((subtotal * discountRate) / 100);

    return {
      items,
      selectedCount: selected.length,
      isComplete,
      oneTime,
      monthly,
      subtotal,
      discountRate,
      discount,
      firstInvoice: subtotal - discount
    };
  }, [selectedPlans, selectedServices]);
  const isComplete = estimate.isComplete;

  const whatsappMessage = encodeURIComponent(
    [
      "Hello DSE Consultancy, I created a custom service plan on your website:",
      ...estimate.items.map(
        ({ service, plan }) =>
          `• ${service.name} — ${plan.name} (${formatInr(plan.price)} ${service.billing})`
      ),
      `Bundle discount: ${estimate.discountRate}% on the first invoice`,
      `Estimated first invoice: ${formatInr(estimate.firstInvoice)}`,
      "Please contact me to confirm the scope and final quotation."
    ].join("\n")
  );

  return (
    <div className="dse-bundle-planner">
      <div className="dse-bundle-services" aria-label="Choose services for your custom plan">
        {pricingServices.map((service) => {
          const selected = Boolean(selectedServices[service.id]);

          return (
            <article className={selected ? "selected" : ""} key={service.id}>
              <label className="dse-bundle-service-toggle">
                <input
                  checked={selected}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setSelectedServices((current) => ({
                      ...current,
                      [service.id]: checked
                    }));
                    setSelectedPlans((current) => ({
                      ...current,
                      [service.id]: checked ? current[service.id] ?? null : null
                    }));
                  }}
                  type="checkbox"
                />
                <span className="dse-bundle-check" aria-hidden="true">
                  <span className="material-symbols-outlined">check</span>
                </span>
                <span className="dse-bundle-number">{service.number}</span>
                <span className="material-symbols-outlined dse-bundle-icon">{service.icon}</span>
                <strong>{service.name}</strong>
                <small>{service.billing}</small>
                <p>{service.description}</p>
              </label>

              <label className="dse-bundle-plan-select">
                Choose Package
                <select
                  aria-label={`Choose a ${service.name} package`}
                  disabled={!selected}
                  onChange={(event) =>
                    setSelectedPlans((current) => ({
                      ...current,
                      [service.id]: event.target.value || null
                    }))
                  }
                  required={selected}
                  value={selectedPlans[service.id] ?? ""}
                >
                  <option disabled value="">
                    Select a package
                  </option>
                  {service.packages.map((plan: PricingPackage) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — {formatInr(plan.price)}
                      {plan.billing === "monthly" ? "/month" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </article>
          );
        })}
      </div>

      <aside className="dse-bundle-summary" aria-live="polite">
        <span className="dse-bundle-summary-kicker">Your Custom Estimate</span>
        <h3>
          {estimate.selectedCount
            ? `${estimate.selectedCount} Service${estimate.selectedCount > 1 ? "s" : ""} Selected`
            : "Choose Your Services"}
        </h3>

        <div className="dse-bundle-summary-items">
          {isComplete ? (
            estimate.items.map(({ service, plan }) => (
              <div key={service.id}>
                <span>
                  <strong>{service.shortName}</strong>
                  <small>{plan.name} · {service.billing}</small>
                </span>
                <b>{formatInr(plan.price)}</b>
              </div>
            ))
          ) : estimate.selectedCount ? (
            <p>Select a package for every chosen service to calculate your estimate.</p>
          ) : (
            <p>Select a service card to begin building your plan.</p>
          )}
        </div>

        <div className="dse-bundle-totals">
          <div><span>First-Invoice Subtotal</span><b>{formatInr(estimate.subtotal)}</b></div>
          <div className="discount">
            <span>Bundle Discount ({estimate.discountRate}%)</span>
            <b>− {formatInr(estimate.discount)}</b>
          </div>
        </div>

        <div className="dse-bundle-final-price">
          <span>Estimated First Invoice</span>
          <strong>{formatInr(estimate.firstInvoice)}</strong>
          {estimate.monthly ? (
            <small>Thereafter: {formatInr(estimate.monthly)}/month for monthly services</small>
          ) : null}
        </div>

        {estimate.discountRate ? (
          <p className="dse-bundle-unlocked">
            <span className="material-symbols-outlined">celebration</span>
            {estimate.discountRate}% bundle saving unlocked
          </p>
        ) : (
          <p className="dse-bundle-locked">
            Select both services to unlock a 10% first-invoice discount.
          </p>
        )}

        {isComplete ? (
          <a
            className="dse-bundle-whatsapp"
            href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
            rel="noreferrer"
            target="_blank"
          >
            Discuss This Plan On WhatsApp <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span aria-disabled="true" className="dse-bundle-whatsapp disabled">
            {estimate.selectedCount ? "Select A Package To Continue" : "Choose A Service To Continue"}
          </span>
        )}
        <a className="dse-bundle-form-link" href="#contact-form">Or Request A Call Back</a>

        <p className="dse-bundle-disclaimer">
          This is an indicative estimate. The bundle discount applies to the first invoice only.
          Final pricing, GST, deliverables and recurring costs are confirmed after a scope review.
        </p>
      </aside>
    </div>
  );
}
