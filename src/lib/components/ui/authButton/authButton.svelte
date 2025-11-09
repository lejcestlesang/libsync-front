<script lang="ts">
  export let icon: string;
  export let label: string;
  export let onClick: () => void;
</script>

<button class="auth-btn" on:click={onClick}>
  <img src={icon} alt={label} class="icon" />
</button>

<style>
  .auth-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .auth-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
  
  .icon {
    width: 126px;
    height: 64px;
    object-fit: contain;
  }
</style>