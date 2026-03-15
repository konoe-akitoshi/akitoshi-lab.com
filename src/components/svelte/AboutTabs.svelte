<script>
  import { slide } from 'svelte/transition';
  import Timeline from './Timeline.svelte';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'i-material-symbols-light-person-outline-rounded' },
    { id: 'affiliated', label: 'Affiliated', icon: 'i-material-symbols-light-domain' },
    { id: 'timeline', label: 'Timeline', icon: 'i-material-symbols-light-co-present-outline-rounded' },
    { id: 'environment', label: 'Environment', icon: 'i-material-symbols-light-shield-with-house-outline-rounded' },
  ];

  let active = $state('profile');
</script>

<div>
  <nav class="tab-bar">
    {#each tabs as tab}
      <button
        class="tab-item"
        class:active={active === tab.id}
        onclick={() => active = tab.id}
      >
        <i class="{tab.icon} text-lg"></i>
        <span class="tab-label">{tab.label}</span>
      </button>
    {/each}
  </nav>

  <div class="tab-content">
    {#if active === 'profile'}
      <div transition:slide={{ duration: 150 }}>
        <slot name="profile" />
      </div>
    {:else if active === 'affiliated'}
      <div transition:slide={{ duration: 150 }}>
        <slot name="affiliated" />
      </div>
    {:else if active === 'timeline'}
      <div transition:slide={{ duration: 150 }}>
        <Timeline />
      </div>
    {:else if active === 'environment'}
      <div transition:slide={{ duration: 150 }}>
        <slot name="environment" />
      </div>
    {/if}
  </div>
</div>

<style>
  .tab-bar {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 16px;
    border: none;
    background: none;
    color: #9ca3af;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: color 0.15s ease, border-color 0.15s ease;
    white-space: nowrap;
  }

  .tab-item:hover {
    color: #4b5563;
  }

  .tab-item.active {
    color: #111827;
    border-bottom-color: #111827;
  }

  .tab-label {
    display: inline;
  }

  @media (max-width: 480px) {
    .tab-label {
      display: none;
    }
    .tab-item {
      padding: 12px 8px;
    }
    .tab-item i {
      font-size: 22px;
    }
  }

  .tab-content {
    min-height: 200px;
  }
</style>
